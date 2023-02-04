import React from 'react';

import { auth } from '../../firebase';

const SignOutButton = () =>
        <div
        className="nav-item" 
            onClick={auth.doSignOut}
        >
            Logout
  </div>

export default SignOutButton;