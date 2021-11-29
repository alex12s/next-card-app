import React, { FC } from 'react';
import styles from './PrettyCard.module.scss';

const PrettyCard: FC<{ backsideContent: React.ReactNode }> = (props) => {
  const { children, backsideContent } = props;
  return (
    <div className={styles.root}>
      <div className={styles.creditCardFrontSide}>{children}</div>
      <div className={`${styles.creditCardBackSide} d-flex justify-content-end align-items-baseline`}>
        {backsideContent}
      </div>
    </div>
  );
};

export default PrettyCard;
