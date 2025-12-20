-- Heuristic repair for lossy "??" sequences (accents lost)
-- This cannot be perfect; it targets common French words/patterns seen in the DB.

USE exped360_db;

-- Properties
UPDATE properties
SET propertyOwnerType = REPLACE(propertyOwnerType, 'Agence immobili??re', 'Agence immobilière')
WHERE propertyOwnerType LIKE '%??%';

UPDATE properties
SET propertyOwnerName = REPLACE(propertyOwnerName, 'immobili??re', 'immobilière')
WHERE propertyOwnerName LIKE '%??%';

UPDATE properties
SET address = REPLACE(
  REPLACE(
    REPLACE(address, 'cot??', 'côté'),
    'A??n', 'Aïn'
  ),
  'Alg??rie', 'Algérie'
)
WHERE address LIKE '%??%';

-- Properties (description): keep this as many small, safe updates.
  UPDATE properties SET description = REPLACE(description, 'm??tres', 'mètres') WHERE description LIKE '%m??tres%';
  UPDATE properties SET description = REPLACE(description, ' m??', ' m²') WHERE description LIKE '% m??%';
  UPDATE properties SET description = REPLACE(description, '360??', '360°') WHERE description LIKE '%360??%';

  UPDATE properties SET description = REPLACE(description, 'D??couvrez', 'Découvrez') WHERE description LIKE '%D??couvrez%';
  UPDATE properties SET description = REPLACE(description, 'D??tails', 'Détails') WHERE description LIKE '%D??tails%';
  UPDATE properties SET description = REPLACE(description, 'D??s', 'Dès') WHERE description LIKE '%D??s%';

  UPDATE properties SET description = REPLACE(description, '?? VENDRE', 'À VENDRE') WHERE description LIKE '%?? VENDRE%';
  UPDATE properties SET description = REPLACE(description, '?? Vendre', 'À Vendre') WHERE description LIKE '%?? Vendre%';
  UPDATE properties SET description = REPLACE(description, '?? vendre', 'À vendre') WHERE description LIKE '%?? vendre%';
  UPDATE properties SET description = REPLACE(description, '?? louer', 'À louer') WHERE description LIKE '%?? louer%';
  UPDATE properties SET description = REPLACE(description, ' ?? ', ' à ') WHERE description LIKE '% ?? %';
  UPDATE properties SET description = REPLACE(description, ' ??? ', ' - ') WHERE description LIKE '% ??? %';

  UPDATE properties SET description = REPLACE(description, '12??? étage', '12ème étage') WHERE description LIKE '%12??? étage%';
  UPDATE properties SET description = REPLACE(description, '8??? étage', '8ème étage') WHERE description LIKE '%8??? étage%';
  UPDATE properties SET description = REPLACE(description, '6??? étage', '6ème étage') WHERE description LIKE '%6??? étage%';
  UPDATE properties SET description = REPLACE(description, '5??? étage', '5ème étage') WHERE description LIKE '%5??? étage%';
  UPDATE properties SET description = REPLACE(description, '4??? étage', '4ème étage') WHERE description LIKE '%4??? étage%';
  UPDATE properties SET description = REPLACE(description, '2??? étage', '2ème étage') WHERE description LIKE '%2??? étage%';
  UPDATE properties SET description = REPLACE(description, '1????? étage', '1er étage') WHERE description LIKE '%1????? étage%';

  UPDATE properties SET description = REPLACE(description, 'situ??e', 'située') WHERE description LIKE '%situ??e%';
  UPDATE properties SET description = REPLACE(description, 'situ??', 'situé') WHERE description LIKE '%situ??%';
  UPDATE properties SET description = REPLACE(description, 'Situ??', 'Situé') WHERE description LIKE '%Situ??%';

  UPDATE properties SET description = REPLACE(description, 's??curis??e', 'sécurisée') WHERE description LIKE '%s??curis??e%';
  UPDATE properties SET description = REPLACE(description, 's??curis??', 'sécurisé') WHERE description LIKE '%s??curis??%';
  UPDATE properties SET description = REPLACE(description, 's??jour', 'séjour') WHERE description LIKE '%s??jour%';
  UPDATE properties SET description = REPLACE(description, 's??jours', 'séjours') WHERE description LIKE '%s??jours%';
  UPDATE properties SET description = REPLACE(description, 'prolong??s', 'prolongés') WHERE description LIKE '%prolong??s%';

  UPDATE properties SET description = REPLACE(description, 'id??al', 'idéal') WHERE description LIKE '%id??al%';
  UPDATE properties SET description = REPLACE(description, 'Id??al', 'Idéal') WHERE description LIKE '%Id??al%';
  UPDATE properties SET description = REPLACE(description, 'agr??able', 'agréable') WHERE description LIKE '%agr??able%';
  UPDATE properties SET description = REPLACE(description, 'cot??', 'côté') WHERE description LIKE '%cot??%';

  UPDATE properties SET description = REPLACE(description, 'Caract??ristiques', 'Caractéristiques') WHERE description LIKE '%Caract??ristiques%';
  UPDATE properties SET description = REPLACE(description, 'caract??ristiques', 'caractéristiques') WHERE description LIKE '%caract??ristiques%';
  UPDATE properties SET description = REPLACE(description, 'pi??ces', 'pièces') WHERE description LIKE '%pi??ces%';
  UPDATE properties SET description = REPLACE(description, 'pi??ce', 'pièce') WHERE description LIKE '%pi??ce%';

  UPDATE properties SET description = REPLACE(description, '?? proximit??', 'à proximité') WHERE description LIKE '%?? proximit??%';
  UPDATE properties SET description = REPLACE(description, '??coles', 'écoles') WHERE description LIKE '%??coles%';
  UPDATE properties SET description = REPLACE(description, 'commodit??s', 'commodités') WHERE description LIKE '%commodit??s%';
  UPDATE properties SET description = REPLACE(description, 'imm??diate', 'immédiate') WHERE description LIKE '%imm??diate%';
  UPDATE properties SET description = REPLACE(description, 'c??ur', 'cœur') WHERE description LIKE '%c??ur%';

  UPDATE properties SET description = REPLACE(description, '??tage', 'étage') WHERE description LIKE '%??tage%';
  UPDATE properties SET description = REPLACE(description, 'd???un', 'd’un') WHERE description LIKE '%d???un%';
  UPDATE properties SET description = REPLACE(description, 'D???une', 'D’une') WHERE description LIKE '%D???une%';
  UPDATE properties SET description = REPLACE(description, 'l???', 'l’') WHERE description LIKE '%l???%';
  UPDATE properties SET description = REPLACE(description, 'd???', 'd’') WHERE description LIKE '%d???%';
  UPDATE properties SET description = REPLACE(description, 's???', 's’') WHERE description LIKE '%s???%';
  UPDATE properties SET description = REPLACE(description, 'qu???', 'qu’') WHERE description LIKE '%qu???%';
  UPDATE properties SET description = REPLACE(description, 'Il s???agit', 'Il s’agit') WHERE description LIKE '%Il s???agit%';

  UPDATE properties SET description = REPLACE(description, 'recherch??', 'recherché') WHERE description LIKE '%recherch??%';
  UPDATE properties SET description = REPLACE(description, 'pris??', 'prisé') WHERE description LIKE '%pris??%';
  UPDATE properties SET description = REPLACE(description, 'Mill??nium', 'Millénium') WHERE description LIKE '%Mill??nium%';
  UPDATE properties SET description = REPLACE(description, 'Opportunit??', 'Opportunité') WHERE description LIKE '%Opportunit??%';
  UPDATE properties SET description = REPLACE(description, 'activit??', 'activité') WHERE description LIKE '%activit??%';
  UPDATE properties SET description = REPLACE(description, 'lib??rale', 'libérale') WHERE description LIKE '%lib??rale%';
  UPDATE properties SET description = REPLACE(description, 'conformit??', 'conformité') WHERE description LIKE '%conformit??%';
  UPDATE properties SET description = REPLACE(description, 'agenc??', 'agencé') WHERE description LIKE '%agenc??%';
  UPDATE properties SET description = REPLACE(description, 'Nich??', 'Niché') WHERE description LIKE '%Nich??%';
  UPDATE properties SET description = REPLACE(description, 'R??sidence', 'Résidence') WHERE description LIKE '%R??sidence%';
  UPDATE properties SET description = REPLACE(description, 'chaudi??re', 'chaudière') WHERE description LIKE '%chaudi??re%';

  UPDATE properties SET description = REPLACE(description, 'int??ressant', 'intéressant') WHERE description LIKE '%int??ressant%';
  UPDATE properties SET description = REPLACE(description, 'b??n??ficie', 'bénéficie') WHERE description LIKE '%b??n??ficie%';
  UPDATE properties SET description = REPLACE(description, 'fa??ades', 'façades') WHERE description LIKE '%fa??ades%';
  UPDATE properties SET description = REPLACE(description, 'fa??ade', 'façade') WHERE description LIKE '%fa??ade%';
  UPDATE properties SET description = REPLACE(description, 'visibilit??', 'visibilité') WHERE description LIKE '%visibilit??%';
  UPDATE properties SET description = REPLACE(description, 's??curit??', 'sécurité') WHERE description LIKE '%s??curit??%';
  UPDATE properties SET description = REPLACE(description, 'luminosit??', 'luminosité') WHERE description LIKE '%luminosit??%';
  UPDATE properties SET description = REPLACE(description, 'tranquillit??', 'tranquillité') WHERE description LIKE '%tranquillit??%';
  UPDATE properties SET description = REPLACE(description, 'enti??rement', 'entièrement') WHERE description LIKE '%enti??rement%';
  UPDATE properties SET description = REPLACE(description, 'Adapt??', 'Adapté') WHERE description LIKE '%Adapt??%';
  UPDATE properties SET description = REPLACE(description, 'acc??s', 'accès') WHERE description LIKE '%acc??s%';
  UPDATE properties SET description = REPLACE(description, 'facilit??', 'facilité') WHERE description LIKE '%facilit??%';
  UPDATE properties SET description = REPLACE(description, 'ind??pendante', 'indépendante') WHERE description LIKE '%ind??pendante%';
  UPDATE properties SET description = REPLACE(description, 'd??tente', 'détente') WHERE description LIKE '%d??tente%';
  UPDATE properties SET description = REPLACE(description, 'D??tente', 'Détente') WHERE description LIKE '%D??tente%';
  UPDATE properties SET description = REPLACE(description, 'Lou??e', 'Louée') WHERE description LIKE '%Lou??e%';
  UPDATE properties SET description = REPLACE(description, 'nuit??e', 'nuitée') WHERE description LIKE '%nuit??e%';
  UPDATE properties SET description = REPLACE(description, 'entr??e', 'entrée') WHERE description LIKE '%entr??e%';
  UPDATE properties SET description = REPLACE(description, 'fen??tres', 'fenêtres') WHERE description LIKE '%fen??tres%';
  UPDATE properties SET description = REPLACE(description, 'fen??tre', 'fenêtre') WHERE description LIKE '%fen??tre%';
  UPDATE properties SET description = REPLACE(description, '??l??gance', 'élégance') WHERE description LIKE '%??l??gance%';
  UPDATE properties SET description = REPLACE(description, 'l’??l??gance', 'l’élégance') WHERE description LIKE '%l’??l??gance%';
  UPDATE properties SET description = REPLACE(description, 'H??tes', 'Hôtes') WHERE description LIKE '%H??tes%';
  UPDATE properties SET description = REPLACE(description, 'h??tes', 'hôtes') WHERE description LIKE '%h??tes%';
  UPDATE properties SET description = REPLACE(description, 'g??n??reux', 'généreux') WHERE description LIKE '%g??n??reux%';
  UPDATE properties SET description = REPLACE(description, 'r??partie', 'répartie') WHERE description LIKE '%r??partie%';
  UPDATE properties SET description = REPLACE(description, 'fonctionnalit??', 'fonctionnalité') WHERE description LIKE '%fonctionnalit??%';
  UPDATE properties SET description = REPLACE(description, 'ext??rieurs', 'extérieurs') WHERE description LIKE '%ext??rieurs%';
  UPDATE properties SET description = REPLACE(description, 'distribu??', 'distribué') WHERE description LIKE '%distribu??%';
  UPDATE properties SET description = REPLACE(description, 'praticit??', 'praticité') WHERE description LIKE '%praticit??%';
  UPDATE properties SET description = REPLACE(description, 'n??cess', 'nécess') WHERE description LIKE '%n??cess%';
  UPDATE properties SET description = REPLACE(description, 'vous ??tes', 'vous êtes') WHERE description LIKE '%vous ??tes%';
  UPDATE properties SET description = REPLACE(description, ' ??tes ', ' êtes ') WHERE description LIKE '% ??tes %';
  UPDATE properties SET description = REPLACE(description, '??difi??e', 'Édifiée') WHERE description LIKE '%??difi??e%';
  UPDATE properties SET description = REPLACE(description, 'g??n??ral', 'général') WHERE description LIKE '%g??n??ral%';
  UPDATE properties SET description = REPLACE(description, 'L???', 'L’') WHERE description LIKE '%L???%';
  UPDATE properties SET description = REPLACE(description, 'Cr??merie', 'Crèmerie') WHERE description LIKE '%Cr??merie%';
  UPDATE properties SET description = REPLACE(description, 'cr??merie', 'crèmerie') WHERE description LIKE '%cr??merie%';
  UPDATE properties SET description = REPLACE(description, 'cl??', 'clé') WHERE description LIKE '%cl??%';
  UPDATE properties SET description = REPLACE(description, 'fr??quent??s', 'fréquentés') WHERE description LIKE '%fr??quent??s%';
  UPDATE properties SET description = REPLACE(description, 'Am??nagements', 'Aménagements') WHERE description LIKE '%Am??nagements%';
  UPDATE properties SET description = REPLACE(description, '??clair??', 'éclairé') WHERE description LIKE '%??clair??%';
  UPDATE properties SET description = REPLACE(description, '??quip??e', 'équipée') WHERE description LIKE '%??quip??e%';
  UPDATE properties SET description = REPLACE(description, '??quip??', 'équipé') WHERE description LIKE '%??quip??%';

  UPDATE properties SET description = REPLACE(description, 'opportunit??', 'opportunité') WHERE description LIKE '%opportunit??%';
  UPDATE properties SET description = REPLACE(description, 'strat??gique', 'stratégique') WHERE description LIKE '%strat??gique%';
  UPDATE properties SET description = REPLACE(description, 'd??veloppement', 'développement') WHERE description LIKE '%d??veloppement%';
  UPDATE properties SET description = REPLACE(description, 'rez-de-chauss??e', 'rez-de-chaussée') WHERE description LIKE '%rez-de-chauss??e%';
  UPDATE properties SET description = REPLACE(description, 'Rez-de-chauss??e', 'Rez-de-chaussée') WHERE description LIKE '%Rez-de-chauss??e%';
  UPDATE properties SET description = REPLACE(description, 'r??sidence', 'résidence') WHERE description LIKE '%r??sidence%';
  UPDATE properties SET description = REPLACE(description, 'r??cente', 'récente') WHERE description LIKE '%r??cente%';
  UPDATE properties SET description = REPLACE(description, 'd??gag??e', 'dégagée') WHERE description LIKE '%d??gag??e%';
  UPDATE properties SET description = REPLACE(description, 'H??pital', 'Hôpital') WHERE description LIKE '%H??pital%';
  UPDATE properties SET description = REPLACE(description, 'acqu??rir', 'acquérir') WHERE description LIKE '%acqu??rir%';
  UPDATE properties SET description = REPLACE(description, 'privil??gi??', 'privilégié') WHERE description LIKE '%privil??gi??%';
  UPDATE properties SET description = REPLACE(description, 'march??', 'marché') WHERE description LIKE '%march??%';
  UPDATE properties SET description = REPLACE(description, 'Bon ??tat', 'Bon état') WHERE description LIKE '%Bon ??tat%';
  UPDATE properties SET description = REPLACE(description, '??lev??', 'élevé') WHERE description LIKE '%??lev??%';

-- Nearby places
UPDATE nearby_places
SET name = REPLACE(
  REPLACE(
    REPLACE(name, 'For??t', 'Forêt'),
    'Mosqu??e', 'Mosquée'
  ),
  'Universit??', 'Université'
)
WHERE name LIKE '%??%';

UPDATE nearby_places
SET name = REPLACE(name, 'Mosqu??', 'Mosquée')
WHERE name LIKE '%Mosqu??%';

-- Demandes
UPDATE demandes
SET propertyLocation = REPLACE(propertyLocation, 'A??n', 'Aïn')
WHERE propertyLocation LIKE '%??%';

UPDATE demandes SET message = REPLACE(message, '360??', '360°') WHERE message LIKE '%360??%';
UPDATE demandes SET message = REPLACE(message, 'D??cision', 'Décision') WHERE message LIKE '%D??cision%';
UPDATE demandes SET message = REPLACE(message, 'Acte notari??', 'Acte notarié') WHERE message LIKE '%Acte notari??%';
UPDATE demandes SET message = REPLACE(message, 'Acte notarié1er', 'Acte notarié, 1er') WHERE message LIKE '%Acte notarié1er%';
UPDATE demandes SET message = REPLACE(message, 'Papier timbr??', 'Papier timbré') WHERE message LIKE '%Papier timbr??%';
UPDATE demandes SET message = REPLACE(message, 'Promotion immobili??re', 'Promotion immobilière') WHERE message LIKE '%Promotion immobili??re%';
UPDATE demandes SET message = REPLACE(message, 'promotion immobili??re', 'promotion immobilière') WHERE message LIKE '%promotion immobili??re%';
UPDATE demandes SET message = REPLACE(message, 'G??n??ral', 'Général') WHERE message LIKE '%G??n??ral%';
UPDATE demandes SET message = REPLACE(message, 'meubl??', 'meublé') WHERE message LIKE '%meubl??%';
UPDATE demandes SET message = REPLACE(message, '??tage', 'étage') WHERE message LIKE '%??tage%';
UPDATE demandes SET message = REPLACE(message, 'm???expliquer', 'm’expliquer') WHERE message LIKE '%m???expliquer%';
UPDATE demandes SET message = REPLACE(message, 'attir??', 'attiré') WHERE message LIKE '%attir??%';
UPDATE demandes SET message = REPLACE(message, 'trouv??', 'trouvé') WHERE message LIKE '%trouv??%';
UPDATE demandes SET message = REPLACE(message, 'int??ressant', 'intéressant') WHERE message LIKE '%int??ressant%';
UPDATE demandes SET message = REPLACE(message, 'activit??', 'activité') WHERE message LIKE '%activit??%';

-- Blog posts
UPDATE blog_posts
SET author = REPLACE(author, '??quipe', 'Équipe')
WHERE author LIKE '%??%';

-- IMPORTANT: do NOT do a blanket replacement like '??' -> '’' here.
-- It can corrupt words where '??' stands for accents (e.g., 'immobili??re').
UPDATE blog_posts
SET title = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(title, 'participe ’', 'participe à'),
      'On se voit ’', 'On se voit à'
    ),
    'd’mos', 'démos'
  ),
  '360’', '360°'
)
WHERE title LIKE '%’%'
   OR title LIKE '%??%';

UPDATE blog_posts
SET seoTitle = REPLACE(
  REPLACE(
    REPLACE(seoTitle, '360??', '360°'),
    'Alg??rie', 'Algérie'
  ),
  'Pourquoi faire une visite virtue\nlle', 'Pourquoi faire une visite virtuelle'
)
WHERE seoTitle LIKE '%??%';

UPDATE blog_posts
SET seoDescription = REPLACE(
  REPLACE(
    REPLACE(seoDescription, '??tapes', 'étapes'),
    'Alg??rie', 'Algérie'
  ),
  '360??', '360°'
)
WHERE seoDescription LIKE '%??%';

UPDATE blog_posts
SET excerpt = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(excerpt, 'pr??senter', 'présenter'),
      'mani??re', 'manière'
    ),
    'D??couvrez', 'Découvrez'
  ),
  'Alg??rie', 'Algérie'
)
WHERE excerpt LIKE '%??%';

UPDATE blog_posts
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(content, 'On se voit ??', 'On se voit à'),
          'participera ??', 'participera à'
        ),
        'l???', 'l’'
      ),
      'd??mos', 'démos'
    ),
    '360??', '360°'
  ),
  'Alg??rie', 'Algérie'
)
WHERE content LIKE '%??%';

UPDATE blog_posts
SET content = REPLACE(
  REPLACE(
    REPLACE(content, 'L???', 'L’'),
    'aujourd???hui', 'aujourd’hui'
  ),
  's???', 's’'
)
WHERE content LIKE '%??%';

UPDATE blog_posts
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(content, 'pr??senter', 'présenter'),
            'visibilit??', 'visibilité'
          ),
          'Cr??er', 'Créer'
        ),
        'fonctionnalit??s', 'fonctionnalités'
      ),
      'tr??s', 'très'
    ),
    'd??sormais', 'désormais'
  ),
  'd??placements', 'déplacements'
)
WHERE content LIKE '%??%';

UPDATE blog_posts
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(content, 'immobili??res', 'immobilières'),
      'diff??rents', 'différents'
    ),
    'immobili??re', 'immobilière'
  ),
  ' ?? ', ' à '
)
WHERE content LIKE '%??%';

-- Quick before/after indicator
SELECT
  (SELECT COUNT(*) FROM properties WHERE description LIKE '%??%') AS properties_desc_still_has_q,
  (SELECT COUNT(*) FROM properties WHERE address LIKE '%??%') AS properties_address_still_has_q,
  (SELECT COUNT(*) FROM blog_posts WHERE content LIKE '%??%') AS blog_posts_content_still_has_q,
  (SELECT COUNT(*) FROM demandes WHERE message LIKE '%??%') AS demandes_message_still_has_q;
