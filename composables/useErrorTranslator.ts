export default function useErrorTranslator() {
    // Dictionnaire des erreurs et traductions
    const errorMessages: { [key: string]: string } = {
      'PostgreSQL error': 'Erreur PostgreSQL',
      'unique_violation': 'Violation de contrainte d\'unicité',
      'not_null_violation': 'Violation de contrainte NOT NULL',
        'validation_failed': 'Veuillez vérifier le champ email',
        'invalid_credentials': 'Identifiants invalides, login ou mot de passe incorrect',
        'duplicate key value violates unique constraint "pending_registrations_email_key"': 'Cet email est déjà utilisé',
        'duplicate key value violates unique constraint "pending_registrations_phone_key"' : 'Ce numéro de téléphone est déjà utilisé',
        'duplicate key value violates unique constraint "pending_registrations_restaurant_name_key"' : 'Ce nom de restaurant est déjà utilisé',
      '400': 'Requête invalide (400)',
      '401': 'Non autorisé (401)',
      '404': 'Ressource introuvable (404)',
      '500': 'Erreur interne du serveur (500)',
    };
  
    // Fonction de traduction des erreurs
    const translateError = (error: { code?: string; message?: string }) => {
      if (!error) return 'Une erreur inconnue est survenue.';
  
      // Si l'erreur a un code
      if (error.code && errorMessages[error.code]) {
        return errorMessages[error.code];
      }
  
      // Si l'erreur a un message explicite
      if (error.message && errorMessages[error.message]) {
        return errorMessages[error.message];
      }
  
      // Retourne le message d'erreur par défaut ou non traduit
      return error.message || 'Une erreur est survenue.';
    };
  
    return { translateError };
  }
  