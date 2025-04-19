// Script de gestion de l'authentification

// Liste des chemins protégés
const PROTECTED_PATHS = [
  '/private/',
  '/clients/',
  '/uperio/',
  '/alliance-marine/',
];

// Liste des utilisateurs administrateurs
const ADMIN_USERS = ['admin'];

// Fonction pour vérifier si un utilisateur est admin
function isAdmin(username) {
  return ADMIN_USERS.includes(username);
}

// Fonction pour masquer les éléments du menu Private pour les utilisateurs non-admin
function hidePrivateMenuItems() {
  // Vérifier si l'utilisateur est administrateur
  const auth = sessionStorage.getItem('auth');
  if (auth) {
    const username = atob(auth).split(':')[0];
    // Si c'est un admin, ne pas masquer les éléments privés
    if (isAdmin(username)) {
      // Pour les admin, on s'assure que les éléments sont visibles
      showPrivateMenuItems();
      return;
    }
  }
  
  // Pour les utilisateurs non-admin, masquer les éléments
  // Masquer les éléments dans le menu principal
  const navItems = document.querySelectorAll('.md-nav__item');
  navItems.forEach(item => {
    const link = item.querySelector('.md-nav__link');
    if (link && (link.textContent.includes('Private') || link.textContent.includes('Clients') || link.textContent.includes('Uperio') || link.textContent.includes('Alliance Marine'))) {
      item.style.display = 'none';
    }
  });
  
  // Masquer TOUS les liens qui contiennent ces termes ou URL
  document.querySelectorAll('a').forEach(link => {
    // Vérifier le href
    const href = link.getAttribute('href');
    // Vérifier le texte du lien
    const text = link.textContent;
    
    if ((href && (
        href.includes('/private/') || 
        href.includes('/clients/') || 
        href.includes('/uperio/') || 
        href.includes('/alliance-marine/')
      )) || 
      (text && (
        text.includes('Private') || 
        text.includes('Clients') || 
        text.includes('Uperio') || 
        text.includes('Alliance Marine')
      ))
    ) {
      // Masquer l'élément lui-même
      link.style.display = 'none';
      
      // Chercher des conteneurs parents à masquer
      const containers = [
        link.closest('.md-footer-nav__link'),
        link.closest('.md-footer-nav__direction'),
        link.closest('article'),
        link.closest('nav'),
        link.closest('div')
      ];
      
      containers.forEach(container => {
        if (container) {
          // Examiner si le conteneur est spécifique à cet élément
          const otherLinks = container.querySelectorAll('a');
          if (otherLinks.length === 1) {
            container.style.display = 'none';
          }
        }
      });
    }
  });
  
  // Masquer les liens de navigation en bas de page (prev/next)
  const footerNav = document.querySelector('.md-footer-nav');
  if (footerNav) {
    // Vérifier spécifiquement les titres dans la barre de navigation
    const footerLinks = footerNav.querySelectorAll('.md-footer-nav__link');
    footerLinks.forEach(link => {
      const title = link.querySelector('.md-footer-nav__title');
      if (title && (
          title.textContent.includes('Private') || 
          title.textContent.includes('Uperio') || 
          title.textContent.includes('Alliance Marine') || 
          title.textContent.includes('Clients')
        )) {
        link.style.display = 'none';
        // Masquer aussi le parent si c'est un élément de direction
        const direction = link.closest('.md-footer-nav__direction');
        if (direction) direction.style.display = 'none';
      }
    });
    
    // Si tous les liens sont masqués, masquer la barre de navigation entière
    if (Array.from(footerLinks).every(link => link.style.display === 'none' || window.getComputedStyle(link).display === 'none')) {
      footerNav.style.display = 'none';
    }
  }
}

// Fonction pour montrer les éléments privés (uniquement pour les administrateurs)
function showPrivateMenuItems() {
  // Afficher les éléments dans le menu principal
  const navItems = document.querySelectorAll('.md-nav__item');
  navItems.forEach(item => {
    const link = item.querySelector('.md-nav__link');
    if (link && (link.textContent.includes('Private') || link.textContent.includes('Clients') || link.textContent.includes('Uperio') || link.textContent.includes('Alliance Marine'))) {
      item.style.display = '';
    }
  });
  
  // Afficher tous les liens qui contiennent ces termes ou URL
  document.querySelectorAll('a').forEach(link => {
    // Vérifier le href
    const href = link.getAttribute('href');
    // Vérifier le texte du lien
    const text = link.textContent;
    
    if ((href && (
        href.includes('/private/') || 
        href.includes('/clients/') || 
        href.includes('/uperio/') || 
        href.includes('/alliance-marine/')
      )) || 
      (text && (
        text.includes('Private') || 
        text.includes('Clients') || 
        text.includes('Uperio') || 
        text.includes('Alliance Marine')
      ))
    ) {
      // Afficher l'élément
      link.style.display = '';
      
      // Chercher des conteneurs parents à afficher
      const containers = [
        link.closest('.md-footer-nav__link'),
        link.closest('.md-footer-nav__direction'),
        link.closest('article'),
        link.closest('nav'),
        link.closest('div')
      ];
      
      containers.forEach(container => {
        if (container) {
          container.style.display = '';
        }
      });
    }
  });
  
  // Afficher les liens de navigation en bas de page
  const footerNav = document.querySelector('.md-footer-nav');
  if (footerNav) {
    footerNav.style.display = '';
    
    // Afficher tous les liens dans le footer
    const footerLinks = footerNav.querySelectorAll('.md-footer-nav__link, .md-footer-nav__direction');
    footerLinks.forEach(link => {
      link.style.display = '';
    });
  }
}

// Fonction pour rediriger les utilisateurs non-admin des pages protégées
function blockProtectedPages() {
  const currentPath = window.location.pathname.toLowerCase();
  const auth = sessionStorage.getItem('auth');
  
  if (!auth) {
    // Pas d'authentification du tout
    if (PROTECTED_PATHS.some(path => currentPath.includes(path.toLowerCase()))) {
      alert('Accès refusé: Cette page est réservée aux administrateurs.');
      window.location.href = '/';
    }
    return;
  }
  
  // Extraire le nom d'utilisateur
  const username = atob(auth).split(':')[0];
  
  // Vérifier si l'utilisateur est un administrateur
  if (!isAdmin(username)) {
    // Vérifier si l'utilisateur est sur une page protégée
    if (PROTECTED_PATHS.some(path => currentPath.includes(path.toLowerCase()))) {
      alert('Accès refusé: Cette page est réservée aux administrateurs.');
      window.location.href = '/';
    }
  }
}

// Fonction pour observer le DOM et appliquer le masquage/affichage quand nécessaire
function setupDOMObserver() {
  // Observer les changements pour les éléments qui peuvent apparaître après le chargement initial
  const observer = new MutationObserver((mutations) => {
    // Vérifier le statut de l'utilisateur pour décider si on masque ou affiche
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      const username = atob(auth).split(':')[0];
      if (isAdmin(username)) {
        showPrivateMenuItems();
      } else {
        hidePrivateMenuItems();
      }
    } else {
      hidePrivateMenuItems();
    }
  });
  
  // Observer tout le document pour les changements
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Fonction pour vérifier l'authentification via les en-têtes HTTP Basic
function checkHttpAuthentication() {
  const auth = document.cookie.match(/netlify-auth-token=([^;]*)/);
  
  if (auth && auth[1]) {
    // L'utilisateur est authentifié via Netlify
    try {
      // Tenter d'obtenir le nom d'utilisateur depuis les cookies ou le localStorage
      const username = localStorage.getItem('username') || 'invite';
      
      // Stocker l'authentification dans sessionStorage pour notre script
      sessionStorage.setItem('auth', btoa(`${username}:password`));
      
      // Si le nom d'utilisateur est connu comme admin, afficher les éléments privés
      if (isAdmin(username)) {
        showPrivateMenuItems();
      } else {
        hidePrivateMenuItems();
      }
    } catch (e) {
      console.error('Erreur lors de la vérification de l\'authentification:', e);
      hidePrivateMenuItems();
    }
  } else {
    // Pas d'authentification Netlify, masquer les éléments privés
    hidePrivateMenuItems();
  }
}

// Fonction principale exécutée immédiatement
(function() {
  // Vérifier d'abord l'authentification HTTP
  checkHttpAuthentication();
  
  // Bloquer l'accès aux pages protégées
  blockProtectedPages();
  
  // Mettre en place l'observateur pour attraper les éléments qui se chargent dynamiquement
  setupDOMObserver();
  
  // Attacher un gestionnaire d'événements au formulaire de connexion s'il existe
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[name="login"]');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Vérifier les identifiants
        if (username === 'admin' && password === 'test123') {
          // Admin - accès complet
          const credentials = btoa(`${username}:${password}`);
          sessionStorage.setItem('auth', credentials);
          localStorage.setItem('username', username);
          window.location.href = '/';
        } else if (username === 'invite' && password === 'invite123') {
          // Utilisateur standard - accès limité
          const credentials = btoa(`${username}:${password}`);
          sessionStorage.setItem('auth', credentials);
          localStorage.setItem('username', username);
          window.location.href = '/';
        } else {
          // Identifiants incorrects
          alert('Nom d\'utilisateur ou mot de passe incorrect');
        }
      });
    }
  });
})(); 