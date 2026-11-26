Object.assign(document.documentElement.style, {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0'
});

Object.assign(document.body.style, {
  margin: '0',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  backgroundColor: '#12131a',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#f1f5f9'
});

const statusBanner = document.createElement('div');
statusBanner.textContent = 'Select a piece to highlight its square';
Object.assign(statusBanner.style, {
  fontSize: '0.95rem',
  fontWeight: '600',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: '#1e202c',
  border: '1px solid #2e3244',
  letterSpacing: '0.02em'
});

const boardWrapper = document.createElement('div');
Object.assign(boardWrapper.style, {
  padding: '14px',
  backgroundColor: '#261c15',
  borderRadius: '12px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
  border: '2px solid #4a3525'
});

const chessboard = document.createElement('div');
Object.assign(chessboard.style, {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 64px)',
  gridTemplateRows: 'repeat(8, 64px)',
  border: '2px solid #1a120b',
  userSelect: 'none'
});

const initialPieces = {
  0: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  1: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  6: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  7: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let selectedSquare = null;

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    const isLight = (row + col) % 2 === 0;
    const defaultBg = isLight ? '#ebd8b7' : '#8b5a2b';
    const coordinate = `${files[col]}${8 - row}`;

    square.dataset.coord = coordinate;
    square.dataset.defaultBg = defaultBg;

    Object.assign(square.style, {
      position: 'relative',
      width: '64px',
      height: '64px',
      backgroundColor: defaultBg,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '42px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease'
    });

    if (col === 0) {
      const rankLabel = document.createElement('span');
      rankLabel.textContent = 8 - row;
      Object.assign(rankLabel.style, {
        position: 'absolute',
        top: '3px',
        left: '5px',
        fontSize: '11px',
        fontWeight: '700',
        color: isLight ? '#8b5a2b' : '#ebd8b7',
        pointerEvents: 'none'
      });
      square.appendChild(rankLabel);
    }

    if (row === 7) {
      const fileLabel = document.createElement('span');
      fileLabel.textContent = files[col];
      Object.assign(fileLabel.style, {
        position: 'absolute',
        bottom: '2px',
        right: '5px',
        fontSize: '11px',
        fontWeight: '700',
        color: isLight ? '#8b5a2b' : '#ebd8b7',
        pointerEvents: 'none'
      });
      square.appendChild(fileLabel);
    }

    if (initialPieces[row]) {
      const piece = document.createElement('span');
      piece.textContent = initialPieces[row][col];
      const isBlackPiece = row < 2;

      Object.assign(piece.style, {
        color: isBlackPiece ? '#18181b' : '#ffffff',
        textShadow: isBlackPiece
          ? '0 1px 2px rgba(255, 255, 255, 0.35)'
          : '0 2px 4px rgba(0, 0, 0, 0.75)',
        lineHeight: '1',
        transition: 'transform 0.15s ease'
      });

      square.appendChild(piece);
    }

    square.addEventListener('mouseenter', () => {
      if (selectedSquare !== square) {
        square.style.filter = 'brightness(1.08)';
      }
    });

    square.addEventListener('mouseleave', () => {
      square.style.filter = 'none';
    });

    square.addEventListener('click', () => {
      if (selectedSquare) {
        selectedSquare.style.backgroundColor = selectedSquare.dataset.defaultBg;
      }

      if (selectedSquare === square) {
        selectedSquare = null;
        statusBanner.textContent = 'Select a piece to highlight its square';
        return;
      }

      selectedSquare = square;
      square.style.backgroundColor = '#eab308';
      statusBanner.textContent = `Selected Square: ${coordinate.toUpperCase()}`;
    });

    chessboard.appendChild(square);
  }
}

boardWrapper.appendChild(chessboard);
document.body.append(statusBanner, boardWrapper);