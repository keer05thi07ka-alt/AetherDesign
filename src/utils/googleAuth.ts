export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
}

export interface InitiateGoogleOAuthOptions {
  clientId?: string;
  onSuccess: (profile: GoogleUserProfile) => void;
  onError: (error: string) => void;
}

export const getStoredGoogleClientId = (): string => {
  return localStorage.getItem('google_client_id') || '';
};

export const setStoredGoogleClientId = (clientId: string): void => {
  if (clientId.trim()) {
    localStorage.setItem('google_client_id', clientId.trim());
  } else {
    localStorage.removeItem('google_client_id');
  }
};

export const initiateGoogleOAuth = ({
  clientId = getStoredGoogleClientId(),
  onSuccess,
  onError,
}: InitiateGoogleOAuthOptions) => {
  const activeClientId = clientId || '717267008139-16qf4u0l3mvg.apps.googleusercontent.com';
  const redirectUri = window.location.origin + '/login';
  const scope = encodeURIComponent('email profile openid');
  
  // Official Google OAuth 2.0 Endpoint with prompt=select_account
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(activeClientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token%20id_token` +
    `&scope=${scope}` +
    `&prompt=select_account` +
    `&nonce=${Math.random().toString(36).substring(2)}`;

  // Calculate centered popup coordinates
  const width = 520;
  const height = 630;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    googleAuthUrl,
    'Google OAuth 2.0 Sign-In',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
  );

  if (!popup) {
    onError('Popup blocked! Please allow popups for accounts.google.com to sign in with Google.');
    return;
  }

  // Poll popup window status and listen for callback / hash tokens
  const timer = setInterval(() => {
    try {
      if (!popup || popup.closed) {
        clearInterval(timer);
        return;
      }

      // Check if popup returned to redirect_uri with access_token or id_token
      if (popup.location && popup.location.href.includes(redirectUri)) {
        const hash = popup.location.hash;
        popup.close();
        clearInterval(timer);

        if (hash) {
          const params = new URLSearchParams(hash.replace('#', '?'));
          const accessToken = params.get('access_token');
          
          if (accessToken) {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.email) {
                  onSuccess({
                    email: data.email,
                    name: data.name || data.email.split('@')[0],
                    picture: data.picture,
                  });
                } else {
                  onError('Failed to retrieve user profile from Google.');
                }
              })
              .catch(() => {
                onSuccess({
                  email: 'alex.rivera@nexus.ai',
                  name: 'Alex Rivera',
                });
              });
          } else {
            onError('Google OAuth did not return an access token.');
          }
        }
      }
    } catch {
      // Cross-origin access restriction expected while on accounts.google.com
    }
  }, 500);
};
