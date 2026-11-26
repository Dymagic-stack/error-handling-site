const scenarios = {
  unsafe: {
    title: 'HTTP 500 · Interner Serverfehler',
    tone: 'danger',
    assessment: 'Risiko sichtbar',
    assessmentText: 'Fehlertexte können SQL-Abfragen, Dateipfade, Framework-Versionen oder interne Abläufe offenlegen.'
  },
  generic: {
    title: 'Etwas ist schiefgelaufen',
    tone: 'warning',
    assessment: 'Schlecht nutzbar',
    assessmentText: 'Eine generische Meldung schützt vor Informationspreisgabe, gibt dem Benutzer aber keine brauchbare nächste Handlung.'
  },
  safe: {
    title: 'Profil vorübergehend nicht verfügbar',
    tone: 'success',
    assessment: 'Sicher und hilfreich',
    assessmentText: 'Der Benutzer erhält eine klare Handlung. Technische Details bleiben nur in kontrollierten internen Logs.'
  }
};

let selectedMode = 'unsafe';
const response = document.querySelector('#response');
const assessment = document.querySelector('#assessment');
const input = document.querySelector('#userId');

function correlationId() {
  const bytes = new Uint32Array(2);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 4294967295);
    bytes[1] = Math.floor(Math.random() * 4294967295);
  }
  return `REQ-${bytes[0].toString(16).padStart(8, '0').toUpperCase()}${bytes[1].toString(16).slice(0, 2).toUpperCase()}`;
}

function renderResult(mode, userId) {
  const config = scenarios[mode];

  if (mode === 'unsafe') {
    response.innerHTML = `<div class="result">
      <div class="result-header ${config.tone}">⚠ ${config.title}</div>
      <div class="result-body"><pre>java.sql.SQLTransientConnectionException:
Connection refused: profiles-db.internal:5432
at com.example.ProfileRepository.findById(ProfileRepository.java:84)
at com.example.UserService.loadProfile(UserService.java:41)

SELECT * FROM users
WHERE id = '${userId}' AND deleted_at IS NULL

System: profile-api-v2.3.7 · prod-node-04
Token: svc_profile_7f39...91a</pre></div>
    </div>`;
  } else if (mode === 'generic') {
    response.innerHTML = `<div class="result">
      <div class="result-header ${config.tone}">ⓘ ${config.title}</div>
      <div class="result-body"><pre>Ein Fehler ist aufgetreten.

Versuchen Sie es später erneut.</pre></div>
    </div>`;
  } else {
    const id = correlationId();
    response.innerHTML = `<div class="result">
      <div class="result-header ${config.tone}">✓ ${config.title}</div>
      <div class="result-body">
        <pre>Wir konnten das Profil gerade nicht laden.
Bitte versuchen Sie es in einigen Minuten erneut.
Bei weiteren Problemen wenden Sie sich an den Support.</pre>
        <div class="result-meta">
          <div class="meta-box"><small>Vorgangsnummer</small><strong>${id}</strong></div>
          <div class="meta-box"><small>Interner Logcode</small><strong>A10-DB-503</strong></div>
        </div>
      </div>
    </div>`;
  }

  assessment.innerHTML = `<p class="assessment-title"><span>${mode === 'safe' ? '✓' : '⚠'}</span> ${config.assessment}</p><p>${config.assessmentText}</p>`;
}

document.querySelectorAll('.scenario').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.scenario').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-checked', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-checked', 'true');
    selectedMode = button.dataset.mode;
  });
});

document.querySelector('#searchButton').addEventListener('click', () => {
  const userId = input.value.trim() || '1042';
  renderResult(selectedMode, userId.replace(/[<>"']/g, ''));
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('#searchButton').click();
});
