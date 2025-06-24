  import styles from './index.module.css'

  const InputField = (props) => {
    return (
      <div className={styles.inputBox}>
        <input
          type='text'
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          className={styles.input}
          maxLength={props.maxLength || undefined}
          required
        />
      </div>
    );
  };


  export default function UserHome(){
      return(
          <div className={styles.wrap}>
            <div className = {styles.InputField}>
                <InputField
                  type="text"
                  placeholder="How may i help you?"
                  
                  />
            </div>
          </div>
      )
  }