CREATE TABLE story (
    id         varchar(255) DEFAULT gen_random_uuid() PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    icon       VARCHAR(255) NOT NULL,
    src        VARCHAR(255) NOT NULL,
    visible    BOOLEAN NOT NULL DEFAULT FALSE,
    stories    JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
