(function () {
  const CHAT_APP_URL = 'https://inquid.github.io/github-chat/';
  const ROOT_ID = 'github-chat-extension-root';

  function getRepositoryFromPath() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return '';
    return `${parts[0]}/${parts[1]}`;
  }

  function createChatUrl() {
    const url = new URL(CHAT_APP_URL);
    const repository = getRepositoryFromPath();

    if (repository) {
      url.searchParams.set('repository', repository);
    }

    url.searchParams.set('page', window.location.href);
    return url.toString();
  }

  function createChatRoot() {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = `
      <button
        class="github-chat-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="github-chat-panel"
      >
        Chat
      </button>
      <section
        id="github-chat-panel"
        class="github-chat-panel"
        aria-label="GitHub chat"
        hidden
      >
        <header class="github-chat-header">
          <div>
            <strong>GitHub Chat</strong>
            <span>${getRepositoryFromPath() || 'github.com'}</span>
          </div>
          <button class="github-chat-close" type="button" aria-label="Close chat">
            ×
          </button>
        </header>
        <iframe
          class="github-chat-frame"
          title="GitHub Chat"
          src="${createChatUrl()}"
          loading="lazy"
        ></iframe>
      </section>
    `;

    document.body.appendChild(root);
    return root;
  }

  function initGithubChat() {
    if (document.getElementById(ROOT_ID)) return;

    const root = createChatRoot();
    const toggle = root.querySelector('.github-chat-toggle');
    const panel = root.querySelector('.github-chat-panel');
    const close = root.querySelector('.github-chat-close');

    function setOpen(isOpen) {
      panel.hidden = !isOpen;
      toggle.setAttribute('aria-expanded', String(isOpen));
    }

    toggle.addEventListener('click', function () {
      setOpen(panel.hidden);
    });

    close.addEventListener('click', function () {
      setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        setOpen(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGithubChat);
  } else {
    initGithubChat();
  }
})();
