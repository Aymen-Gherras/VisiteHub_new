USE exped360_db;

SELECT id, LEFT(description, 250) AS sample
FROM properties
WHERE description LIKE '%??%'
LIMIT 30;

SELECT DISTINCT name
FROM nearby_places
WHERE name LIKE '%??%'
LIMIT 50;

SELECT id, LEFT(message, 250) AS sample
FROM demandes
WHERE message LIKE '%??%'
LIMIT 30;

SELECT id, LEFT(content, 250) AS sample
FROM blog_posts
WHERE content LIKE '%??%'
LIMIT 10;
