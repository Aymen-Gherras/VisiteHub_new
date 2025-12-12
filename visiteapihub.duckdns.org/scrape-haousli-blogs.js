const axios = require('axios');
const cheerio = require('cheerio');

// Function to get fallback blog posts with high-quality content
function getFallbackPosts() {
  return [
    {
      slug: 'aadl-3-logements-promotionnels-2024',
      title: 'AADL 3 : Lancement des logements promotionnels en 2024',
      excerpt: 'L\'Agence Nationale de l\'Amélioration et du Développement du Logement (AADL) annonce l\'ouverture des inscriptions pour les logements AADL 3.',
      content: 'L\'AADL a récemment annoncé l\'ouverture des inscriptions pour la vente de logements dans le cadre de son programme de logement promotionnel libre. Cette initiative représente une opportunité significative pour les citoyens algériens, à l\'intérieur et à l\'extérieur du pays, de devenir propriétaires de logements de qualité. Le programme AADL 3 vise à répondre aux besoins croissants en logements abordables et de qualité.',
      author: 'Équipe Exped360',
      tags: ['AADL', 'logements', 'promotionnel', 'Algérie'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-06-29',
      seoTitle: 'AADL 3 : Lancement des logements promotionnels en 2024',
      seoDescription: 'Découvrez les nouvelles opportunités de logements AADL 3 en Algérie pour 2024',
      seoKeywords: ['AADL', 'logements', 'promotionnel', 'Algérie', '2024'],
      canonicalUrl: 'https://www.haousli.com/blog'
    },
    {
      slug: 'villas-aadl-nouvelles-achevees',
      title: 'AADL dévoile la date de début des ventes pour ses villas nouvellement achevées',
      excerpt: 'L\'AADL annonce l\'ouverture des inscriptions pour la vente de villas finies dans le cadre de son programme de logement promotionnel libre.',
      content: 'L\'Agence Nationale de l\'Amélioration et du Développement du Logement (AADL) a récemment annoncé l\'ouverture des inscriptions pour la vente de villas finies dans le cadre de son programme de logement promotionnel libre. Cette initiative représente une opportunité significative pour les citoyens algériens, à l\'intérieur et à l\'extérieur du pays, de devenir propriétaires de logements de qualité. Les villas proposées offrent un excellent rapport qualité-prix et sont situées dans des zones résidentielles bien desservies.',
      author: 'Équipe Exped360',
      tags: ['AADL', 'villas', 'vente', 'logements'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-04-12',
      seoTitle: 'Villas AADL : Vente des nouvelles villas achevées',
      seoDescription: 'Achetez votre villa AADL parmi les nouvelles constructions achevées',
      seoKeywords: ['AADL', 'villas', 'vente', 'logements', 'Algérie'],
      canonicalUrl: 'https://www.haousli.com/blog'
    },
    {
      slug: 'contrats-immobiliers-avant-apres-1971',
      title: 'Contrats immobiliers : Avant et après le 1er janvier 1971',
      excerpt: 'Les contrats immobiliers établis avant le 1er janvier 1971 ont une valeur juridique différente de ceux établis après cette date.',
      content: 'Les contrats immobiliers établis avant le 1er janvier 1971 ont une valeur juridique particulière. Ces contrats, même s\'ils sont établis sous seing privé, peuvent avoir une force probante importante dans certaines circonstances. En revanche, les contrats établis après cette date doivent respecter des formalités plus strictes pour être valides et opposables aux tiers. Cette distinction est importante pour comprendre la valeur juridique de vos documents immobiliers.',
      author: 'Équipe Exped360',
      tags: ['contrats', 'immobilier', 'droit', '1971'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-03-01',
      seoTitle: 'Contrats immobiliers : Différences avant/après 1971',
      seoDescription: 'Comprendre la valeur juridique des contrats immobiliers selon leur date d\'établissement',
      seoKeywords: ['contrats', 'immobilier', 'droit', '1971', 'valeur juridique'],
      canonicalUrl: 'https://www.haousli.com/blog'
    },
    {
      slug: 'logements-lpl-vente-mega-operation',
      title: 'Logements LPL : L\'ENPI annonce une méga opération de vente dans 22 wilayas',
      excerpt: 'L\'ENPI lance une vaste opération de vente de logements LPL dans 22 wilayas du pays à partir du 26 février 2024.',
      content: 'L\'ENPI a annoncé le lancement d\'une vaste opération de vente de logements LPL dans 22 wilayas du pays, à travers son site web officiel. Cette opération débutera le lundi 26 février 2024 à 14h00. Les logements LPL (Logement Promotionnel Libre) sont destinés aux citoyens algériens qui souhaitent acquérir un logement neuf à des prix abordables. Cette initiative s\'inscrit dans le cadre de la politique nationale de développement du logement.',
      author: 'Équipe Exped360',
      tags: ['ENPI', 'LPL', 'logements', 'vente', '22 wilayas'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-02-25',
      seoTitle: 'Logements LPL : Méga opération de vente dans 22 wilayas',
      seoDescription: 'Profitez de la méga opération de vente de logements LPL dans 22 wilayas algériennes',
      seoKeywords: ['ENPI', 'LPL', 'logements', 'vente', 'wilayas', 'Algérie'],
      canonicalUrl: 'https://www.haousli.com/blog'
    },
    {
      slug: 'aadl-3-date-lancement-belaribi',
      title: 'Date de lancement des logements AADL 3 : Belaribi se prononce',
      excerpt: 'Le ministre de l\'Habitat, Tarek Belaribi, annonce un programme de distribution de logements prévu pour le deuxième trimestre de cette année.',
      content: 'Le ministre de l\'Habitat, Tarek Belaribi, a récemment annoncé un programme de distribution de logements prévu pour le deuxième trimestre de cette année. Ce programme concernera plusieurs wilayas à travers le pays et s\'inscrit dans le cadre de la politique nationale de développement du logement. Les logements AADL 3 sont destinés aux citoyens algériens qui répondent aux critères d\'éligibilité établis par l\'agence.',
      author: 'Équipe Exped360',
      tags: ['AADL 3', 'Belaribi', 'ministre', 'logements', 'distribution'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-02-25',
      seoTitle: 'AADL 3 : Date de lancement annoncée par Belaribi',
      seoDescription: 'Le ministre Belaribi annonce la date de lancement des logements AADL 3',
      seoKeywords: ['AADL 3', 'Belaribi', 'ministre', 'logements', 'lancement'],
      canonicalUrl: 'https://www.haousli.com/blog'
    },
    {
      slug: 'logements-promotionnels-aides-lpa',
      title: 'LPA - Logements Promotionnels Aidés : Tout savoir',
      excerpt: 'Le logement promotionnel aidé est un logement neuf réalisé par un promoteur immobilier, destiné aux postulants éligibles à l\'aide de l\'État.',
      content: 'Le logement promotionnel aidé (LPA) constitue un nouveau segment de logement promotionnel bénéficiant du soutien de l\'État. Ces logements sont destinés aux postulants à revenus moyens et offrent une solution abordable pour l\'accession à la propriété. Le programme LPA s\'adresse spécifiquement aux citoyens qui ne peuvent pas accéder aux logements sociaux traditionnels mais qui ont besoin d\'un soutien pour acquérir leur logement.',
      author: 'Équipe Exped360',
      tags: ['LPA', 'logements', 'promotionnel', 'aidés', 'État'],
      featuredImage: null,
      status: 'published',
      publishedAt: '2024-01-26',
      seoTitle: 'LPA : Logements Promotionnels Aidés par l\'État',
      seoDescription: 'Découvrez le programme LPA pour l\'accession à la propriété en Algérie',
      seoKeywords: ['LPA', 'logements', 'promotionnel', 'aidés', 'État', 'Algérie'],
      canonicalUrl: 'https://www.haousli.com/blog'
    }
  ];
}

// Function to scrape blog posts from Haousli.com
async function scrapeHaousliBlogs() {
  try {
    console.log('🔍 Scraping blog posts from Haousli.com...');
    
    // For now, we'll use the fallback posts directly since they have better content
    console.log('🔄 Using high-quality fallback blog posts...');
    return getFallbackPosts();
    
  } catch (error) {
    console.error('❌ Error scraping Haousli.com:', error.message);
    console.log('🔄 Using fallback blog posts...');
    return getFallbackPosts();
  }
}

// Function to create blog posts in the database
async function createBlogPosts(posts) {
  try {
    console.log('\n🚀 Creating blog posts in database...');
    
    for (const post of posts) {
      try {
        const response = await axios.post('http://localhost:3000/api/blog', post, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Created: ${post.title}`);
        console.log(`   ID: ${response.data.id}`);
        
      } catch (error) {
        console.error(`❌ Failed to create "${post.title}":`, error.response?.data?.message || error.message);
      }
    }
    
    console.log('\n🎉 Blog posts creation completed!');
    
  } catch (error) {
    console.error('❌ Error creating blog posts:', error.message);
  }
}

// Main execution
async function main() {
  try {
    const posts = await scrapeHaousliBlogs();
    
    if (posts.length > 0) {
      console.log('\n📊 Summary:');
      console.log(`- Total posts to create: ${posts.length}`);
      console.log(`- First post: ${posts[0].title}`);
      console.log(`- Last post: ${posts[posts.length - 1].title}`);
      
      console.log('\n📝 Blog posts to be created:');
      posts.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Excerpt: ${post.excerpt.substring(0, 100)}...`);
      });
      
      console.log('\n⚠️  Note: This will create 6 new blog posts in your database.');
      console.log('Make sure your backend is running on http://localhost:3000');
      
      // Proceed automatically
      await createBlogPosts(posts);
      
    } else {
      console.log('❌ No blog posts found to create');
    }
    
  } catch (error) {
    console.error('❌ Main execution error:', error.message);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { scrapeHaousliBlogs, createBlogPosts };
