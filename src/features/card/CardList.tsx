import React, { FC, useCallback, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { getCards } from './cardSlice';
import { Card } from '../../types/Card';
import Link from 'next/link';

const CardList: FC = () => {
  const cards: Card[] = useAppSelector(getCards);

  return (
    <div>
      <ol className="list-group list-group-numbered">
        {(!cards || !cards.length) && (
          <div className="alert alert-dark" role="alert">
            You haven't added any cards yet
          </div>
        )}
        {cards &&
          cards.map((card) => (
            <li key={card.number} className="list-group-item">
              <Link href="/card/111">
                <a>
                  <b>{card.name || '--'}</b>
                  <span className="font-monospace">{`${card.number.substring(0, 4)} XXXX XXXX ${card.number.substring(
                    12
                  )}`}</span>
                </a>
              </Link>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default CardList;
