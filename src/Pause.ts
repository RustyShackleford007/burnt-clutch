// TO BE IMPLEMENTED

export function createPauseMenu(opts: { onResume: () => void; onQuit: () => void }) {
    const style = document.createElement('style');
    style.textContent = `
  #pauseMenu {
    position: fixed; inset: 0; display: none;
    background: rgba(0,0,0,0.55);
    align-items: center; justify-content: center;
    z-index: 9999;
  }
  #pauseMenu .panel {
    background: #111; color: #fff;
    padding: 24px 28px; border-radius: 12px;
    min-width: 260px; text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  #pauseMenu h2 { margin: 0 0 16px; font-size: 20px; }
  #pauseMenu button {
    display: block; width: 100%; margin: 10px 0; padding: 10px 14px;
    border: 0; border-radius: 10px; font-size: 16px; cursor: pointer;
    background: #2b6cb0; color: #fff;
  }
  #pauseMenu button.secondary { background: #4a5568; }
  #pauseMenu button:hover { filter: brightness(1.08); }
  `;
    document.head.appendChild(style);
  
    const root = document.createElement('div');
    root.id = 'pauseMenu';
    root.innerHTML = `
      <div class="panel" role="dialog" aria-modal="true" aria-label="Paused">
        <h2>Paused</h2>
        <button id="pmResume">Resume</button>
        <button id="pmQuit" class="secondary">Quit to Load Screen</button>
        <p style="opacity:.7; font-size:12px; margin-top:8px;">Press Esc to resume</p>
      </div>
    `;
    document.body.appendChild(root);
  
    // prevent Esc from bubbling to the page when focused inside the menu (optional)
    root.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') e.stopPropagation();
    });
  
    const resumeBtn = root.querySelector<HTMLButtonElement>('#pmResume')!;
    const quitBtn   = root.querySelector<HTMLButtonElement>('#pmQuit')!;
    resumeBtn.addEventListener('click', opts.onResume);
    quitBtn.addEventListener('click', opts.onQuit);
  
    return {
      show() { root.style.display = 'flex'; resumeBtn.focus(); },
      hide() { root.style.display = 'none'; }
    };
  }