CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'work',
    hours_week NUMERIC(6,1) NOT NULL DEFAULT 0,
    rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    duration INTEGER NOT NULL DEFAULT 60,
    price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(200) NOT NULL,
    staff_name VARCHAR(200) NOT NULL DEFAULT '',
    client_name VARCHAR(200) NOT NULL DEFAULT '',
    amount INTEGER NOT NULL DEFAULT 0,
    method VARCHAR(20) NOT NULL DEFAULT 'card',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO staff (name, role, status, hours_week, rating) VALUES
('Анна Петрова', 'Массажист-терапевт', 'work', 34, 4.9),
('Игорь Соколов', 'Мастер спортивного массажа', 'work', 31, 4.8),
('Мария Ким', 'Специалист тайского массажа', 'break', 28, 5.0),
('Дмитрий Волков', 'Массажист', 'work', 36, 4.7),
('Елена Рощина', 'Мастер SPA-программ', 'off', 22, 4.9);

INSERT INTO services (name, category, description, duration, price) VALUES
('Классический массаж спины', 'Классика', 'Расслабляющая проработка мышц спины и шейно-воротниковой зоны', 45, 2500),
('Общий массаж тела', 'Классика', 'Комплексная работа со всеми группами мышц', 90, 4200),
('Спортивный массаж', 'Спорт', 'Восстановление и подготовка мышц для активных людей', 60, 3400),
('Тайский массаж', 'Восток', 'Традиционные техники с элементами йога-стретчинга', 90, 4800),
('Антицеллюлитный массаж', 'SPA', 'Интенсивная коррекция и лимфодренаж', 60, 3200),
('Стоун-терапия', 'SPA', 'Массаж горячими вулканическими камнями', 75, 3900);

INSERT INTO sales (service_name, staff_name, client_name, amount, method) VALUES
('Классический массаж спины', 'Анна Петрова', 'Ольга М.', 2500, 'card'),
('Спортивный массаж', 'Игорь Соколов', 'Андрей К.', 3400, 'card'),
('Тайский массаж', 'Мария Ким', 'Ирина В.', 4800, 'cash'),
('Общий массаж тела', 'Дмитрий Волков', 'Сергей Л.', 4200, 'card'),
('Стоун-терапия', 'Анна Петрова', 'Юлия Р.', 3900, 'card'),
('Антицеллюлитный массаж', 'Мария Ким', 'Наталья С.', 3200, 'cash');