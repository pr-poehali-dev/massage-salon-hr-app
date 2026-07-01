import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def _resp(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'isBase64Encoded': False,
        'body': json.dumps(body, default=str, ensure_ascii=False),
    }


def handler(event, context):
    '''Управление данными массажного салона: сотрудники, услуги и продажи.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return _resp(200, {})

    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'sales')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except (ValueError, TypeError):
            body = {}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if resource == 'staff':
            return _handle_staff(cur, method, body)
        if resource == 'services':
            return _handle_services(cur, method, body)
        if resource == 'sales':
            return _handle_sales(cur, method, body)
        if resource == 'stats':
            return _handle_stats(cur)
        return _resp(400, {'error': 'unknown resource'})
    finally:
        cur.close()
        conn.close()


def _esc(v):
    return str(v).replace("'", "''")


def _handle_staff(cur, method, body):
    if method == 'GET':
        cur.execute('SELECT * FROM staff ORDER BY id')
        return _resp(200, {'items': cur.fetchall()})
    if method == 'POST':
        name = _esc(body.get('name', ''))
        role = _esc(body.get('role', ''))
        status = _esc(body.get('status', 'work'))
        hours = float(body.get('hours_week', 0) or 0)
        rating = float(body.get('rating', 5.0) or 5.0)
        cur.execute(
            "INSERT INTO staff (name, role, status, hours_week, rating) "
            f"VALUES ('{name}', '{role}', '{status}', {hours}, {rating}) RETURNING *"
        )
        return _resp(200, {'item': cur.fetchone()})
    if method == 'DELETE':
        sid = int(body.get('id', 0))
        cur.execute(f'DELETE FROM staff WHERE id = {sid}')
        return _resp(200, {'ok': True})
    return _resp(405, {'error': 'method not allowed'})


def _handle_services(cur, method, body):
    if method == 'GET':
        cur.execute('SELECT * FROM services ORDER BY id')
        return _resp(200, {'items': cur.fetchall()})
    if method == 'POST':
        name = _esc(body.get('name', ''))
        category = _esc(body.get('category', ''))
        desc = _esc(body.get('description', ''))
        duration = int(body.get('duration', 60) or 60)
        price = int(body.get('price', 0) or 0)
        cur.execute(
            "INSERT INTO services (name, category, description, duration, price) "
            f"VALUES ('{name}', '{category}', '{desc}', {duration}, {price}) RETURNING *"
        )
        return _resp(200, {'item': cur.fetchone()})
    if method == 'DELETE':
        sid = int(body.get('id', 0))
        cur.execute(f'DELETE FROM services WHERE id = {sid}')
        return _resp(200, {'ok': True})
    return _resp(405, {'error': 'method not allowed'})


def _handle_sales(cur, method, body):
    if method == 'GET':
        cur.execute("SELECT * FROM sales ORDER BY created_at DESC LIMIT 100")
        return _resp(200, {'items': cur.fetchall()})
    if method == 'POST':
        service = _esc(body.get('service_name', ''))
        staff = _esc(body.get('staff_name', ''))
        client = _esc(body.get('client_name', ''))
        amount = int(body.get('amount', 0) or 0)
        method_pay = _esc(body.get('method', 'card'))
        cur.execute(
            "INSERT INTO sales (service_name, staff_name, client_name, amount, method) "
            f"VALUES ('{service}', '{staff}', '{client}', {amount}, '{method_pay}') RETURNING *"
        )
        return _resp(200, {'item': cur.fetchone()})
    return _resp(405, {'error': 'method not allowed'})


def _handle_stats(cur):
    cur.execute("SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt FROM sales WHERE created_at::date = now()::date")
    today = cur.fetchone()
    cur.execute(
        "SELECT staff_name, COALESCE(SUM(amount),0) AS revenue, COUNT(*) AS sessions "
        "FROM sales GROUP BY staff_name ORDER BY revenue DESC LIMIT 5"
    )
    top = cur.fetchall()
    cur.execute(
        "SELECT to_char(created_at::date, 'YYYY-MM-DD') AS day, COALESCE(SUM(amount),0) AS value "
        "FROM sales WHERE created_at > now() - interval '7 days' GROUP BY day ORDER BY day"
    )
    week = cur.fetchall()
    return _resp(200, {'today': today, 'top': top, 'week': week})
