-- ZeroCarbon — schema MySQL 5.7+ / 8.x / MariaDB 10.3+
-- Use `npm run db:migrate` (cria o banco se não existir) ou rode este arquivo
-- manualmente dentro de um banco já criado e selecionado (USE zerocarbon;).

CREATE TABLE IF NOT EXISTS users (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  username          VARCHAR(50)   NOT NULL,
  email             VARCHAR(255)  NOT NULL,
  password_hash     VARCHAR(255)  NOT NULL,
  first_name        VARCHAR(100)  NOT NULL DEFAULT '',
  last_name         VARCHAR(100)  NOT NULL DEFAULT '',
  birth_date        DATE          NULL,
  location          VARCHAR(120)  NULL,
  monthly_goal_tco2 DECIMAL(8,3)  NOT NULL DEFAULT 0.500,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Um registro por usuário por mês: recalcular no mesmo mês atualiza o registro.
CREATE TABLE IF NOT EXISTS carbon_records (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          INT UNSIGNED  NOT NULL,
  period_month     DATE          NOT NULL COMMENT 'Sempre o dia 1 do mês',
  electricity_kwh  DECIMAL(12,2) NOT NULL,
  gas_m3           DECIMAL(12,2) NOT NULL,
  distance_km      DECIMAL(12,2) NOT NULL,
  fuel_factor      DECIMAL(6,3)  NOT NULL,
  electricity_tco2 DECIMAL(10,4) NOT NULL,
  gas_tco2         DECIMAL(10,4) NOT NULL,
  transport_tco2   DECIMAL(10,4) NOT NULL,
  total_tco2       DECIMAL(10,4) NOT NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_records_user_period (user_id, period_month),
  CONSTRAINT fk_records_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
