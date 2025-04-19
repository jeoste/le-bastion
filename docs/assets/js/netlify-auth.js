// Script d'intégration avec l'authentification Netlify

document.addEventListener('DOMContentLoaded', function() {
  // Ajouter un bouton de connexion/déconnexion dans le header
  const header = document.querySelector('.md-header__inner');
  if (header) {
    // Vérifier si l'utilisateur est authentifié
    const auth = sessionStorage.getItem('auth');
    const username = auth ? atob(auth).split(':')[0] : 'invité';
    
    // Supprimer les boutons existants s'il y en a
    const existingButton = header.querySelector('.auth-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    const existingIndicator = header.querySelector('.user-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // Ajouter le conteneur pour les éléments d'authentification
    const authContainer = document.createElement('div');
    authContainer.style.display = 'flex';
    authContainer.style.alignItems = 'center';
    authContainer.style.marginLeft = 'auto';
    authContainer.style.gap = '10px';
    
    // Ajouter un indicateur d'utilisateur
    const userIndicator = document.createElement('span');
    userIndicator.className = 'user-indicator';
    userIndicator.textContent = `Connecté: ${username}`;
    userIndicator.style.color = 'var(--md-primary-bg-color)';
    authContainer.appendChild(userIndicator);
    
    // Ajouter le bouton approprié
    const authButton = document.createElement('button');
    authButton.className = 'md-header__button auth-button';
    authButton.style.border = 'none';
    authButton.style.background = 'transparent';
    authButton.style.color = 'var(--md-primary-bg-color)';
    authButton.style.cursor = 'pointer';
    authButton.style.padding = '4px 8px';
    authButton.style.borderRadius = '4px';
    authButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    
    if (username === 'invité') {
      // Bouton de connexion pour invité
      authButton.textContent = 'Connexion';
      authButton.addEventListener('click', function() {
        window.location.href = '/login/';
      });
    } else {
      // Bouton de déconnexion pour les autres
      authButton.textContent = 'Déconnexion';
      authButton.addEventListener('click', function() {
        // Supprimer l'authentification
        sessionStorage.removeItem('auth');
        localStorage.removeItem('username');
        window.location.href = '/';
      });
    }
    
    authContainer.appendChild(authButton);
    header.appendChild(authContainer);
  }
}); 