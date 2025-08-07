import styles from './index.module.css';

export default function DataChange(){
    return(
        <div className={styles.wrapper}>
            <div className={styles.dropDownWrapper}>
                <label for="option">Choose</label>
                <select className={styles.dropDown} name='option' >
                </select>
            </div>
        </div>
    )
}