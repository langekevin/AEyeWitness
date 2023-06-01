import React from 'react';
import styles from './Navbar.module.scss';

const Navbar = () => {

    return (
        <div className={styles.NavBar}>
            <div className={styles.Logo}>
                <a href='/'>AEyeWitness</a>
            </div>
            <div className={styles.MenuItemsContainer}>
                <ul className={styles.MenuItems}>
                    <li><a href='/'>Home</a></li>
                    <li><a href='/upload'>Upload</a></li>
                </ul>
            </div>
        </div>
        
    )
}

export default Navbar;
