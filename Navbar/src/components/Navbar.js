import React from 'react';

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
        Trading Analytics Pro
      </div>
      <div className="navbar-right">
        <button>დაშბორდი</button>
        <button>სტრატეგიები</button>
        <button>ანალიზი</button>
        <button>დახმარება</button>
      </div>
    </div>
  );
}

export default Navbar;