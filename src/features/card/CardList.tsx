import React, { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteCard, getCards } from './cardSlice';
import { Card } from '../../types/Card';
import Link from 'next/link';
import { CardListFilter, CardSort } from '../../types/Filter';
import CardFilters from './CardFilters';

const CardList: FC = () => {
  const [filter, setFilter] = useState<CardListFilter>({} as CardListFilter);
  const [sort, setSort] = useState<CardSort>(null);
  const cards: Card[] = useAppSelector(getCards(filter, sort));
  const dispatch = useAppDispatch();

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setSort(null);
    } else {
      setSort(e.target.value as CardSort);
    }
  };

  const handleDelete = (id: string) => () => {
    dispatch(deleteCard(id));
  };

  return (
    <div>
      <CardFilters apply={setFilter} />
      <div className="container-fluid mb-4">
        <div>
          <h5>Sorting</h5>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sortOpt"
              id="sort1"
              value="expDate"
              checked={sort === 'expDate'}
              onChange={handleSortChange}
            />
            <label className="form-check-label" htmlFor="sort1">
              Sort by expiration date
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sortOpt"
              id="sort2"
              value="type"
              checked={sort === 'type'}
              onChange={handleSortChange}
            />
            <label className="form-check-label" htmlFor="sort2">
              Sort by type
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sortOpt"
              id="sort3"
              value=""
              checked={sort === null}
              onChange={handleSortChange}
            />
            <label className="form-check-label" htmlFor="sort3">
              No sorting
            </label>
          </div>
        </div>
      </div>
      <h3 className="mb-3">Cards</h3>
      {(!cards || !cards.length) && (
        <div className="alert alert-dark" role="alert">
          No data
        </div>
      )}
      <ul className="list-group">
        {cards &&
          cards.map((card) => (
            <li key={card.id} className="list-group-item">
              <div className="row">
                <div className="col-md-2">
                  <Link href={`/card/${card.id}`}>
                    <a>
                      <b>{card.name || '--'}</b>
                    </a>
                  </Link>
                </div>
                <div className="col-md-4">
                  <span className="font-monospace">
                    {`${card.number.substring(0, 4)} XXXX XXXX ${card.number.substring(12)}`}
                  </span>
                </div>
                <div className="col-md-2">{card.expDate}</div>
                <div className="col-md-2">{!!card.type && <span>{card.type}</span>}</div>
                <div className="col-md-2 d-flex justify-content-end">
                  <button className="btn btn-danger btn-sm" onClick={handleDelete(card.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CardList;
