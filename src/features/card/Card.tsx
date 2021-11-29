import React, { FC } from 'react';
import { useAppSelector } from '../../app/hooks';
import { getCardById } from './cardSlice';
import { CardType } from '../../types/Card';
import PrettyCard from '../../app/components/PrettyCard';
import styles from './Card.module.scss';

const Card: FC<{ id: string }> = ({ id }) => {
  const card = useAppSelector(getCardById(id));

  if (!card) {
    return (
      <div className="alert alert-warning" role="alert">
        Something went wrong.
      </div>
    );
  }
  return (
    <div>
      <h3 className="text-center mb-3">{card.name ?? '--'}</h3>
      <PrettyCard
        backsideContent={
          <div>
            <div>CVV</div>
            <div className="">###</div>
          </div>
        }
      >
        <div className="p-2 d-flex flex-column justify-content-between align-items-sm-start h-100">
          <div className="mb-4">
            <div>Card Number</div>
            <div className={`font-monospace ${styles.bigFontSize}`}>
              {`${card.number.substring(0, 4)} XXXX XXXX ${card.number.substring(12)}`}
            </div>
          </div>

          <div className="mb-4">
            <div>Expiration Date</div>
            <div>{card.expDate}</div>
          </div>

          <div className="row align-items-center">
            <div className="col-9">
              <div>Card Holder</div>
              <div className="text-uppercase">{card.holder}</div>
            </div>
            <div className="col-3">
              {card.type === CardType.mastercard && <img src="/m-logo.png" className={styles.logo} />}
              {card.type === CardType.visa && <img src="/v-logo.png" className={styles.logo} />}
            </div>
          </div>
        </div>
      </PrettyCard>
    </div>
  );
};

export default Card;
