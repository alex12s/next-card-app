import React, { FC, useState } from 'react';
import { CardType } from '../../types/Card';
import { CardListFilter, Comparing } from '../../types/Filter';
import {expDateSlashHandler} from "../../app/utils";

const CardListFilters: FC<{ apply: (f: CardListFilter) => void }> = (props) => {
  const [type, setType] = useState<CardType>(null);
  const [comp, setComp] = useState<Comparing>(Comparing.more);
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setType(null);
    } else {
      setType(e.target.value as CardType);
    }
  };

  const handleCompChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComp(e.target.value as Comparing);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(expDateSlashHandler(e.target.value, date));
  };

  const handleApplyFilters = () => {
    props.apply({ type, expDateFilter: date ? { date, comp } : null, name });
  };

  return (
    <div className="mb-4">
      <h4>Filters</h4>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 col-sm-6 mb-3">
            <h5>Expiration Date</h5>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="comp"
                id="less"
                value={Comparing.less}
                checked={comp === Comparing.less}
                onChange={handleCompChange}
              />
              <label className="form-check-label" htmlFor="less">
                Less than
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="comp"
                id="more"
                value={Comparing.more}
                checked={comp === Comparing.more}
                onChange={handleCompChange}
              />
              <label className="form-check-label" htmlFor="more">
                More than
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="comp"
                id="eq"
                value={Comparing.equal}
                checked={comp === Comparing.equal}
                onChange={handleCompChange}
              />
              <label className="form-check-label" htmlFor="eq">
                Equal
              </label>
            </div>
            <input className="form-control" id="expDate" placeholder="MM/YY" onChange={handleDateChange} value={date} />
          </div>

          <div className="col-md-4 col-sm-6 mb-3">
            <h5>Card type</h5>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value={CardType.visa}
                checked={type === CardType.visa}
                onChange={handleTypeChange}
              />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Visa
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value={CardType.mastercard}
                checked={type === CardType.mastercard}
                onChange={handleTypeChange}
              />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Mastercard
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio3"
                value=""
                checked={type === null}
                onChange={handleTypeChange}
              />
              <label className="form-check-label" htmlFor="inlineRadio3">
                All
              </label>
            </div>
          </div>

          <div className="col-md-4 col-sm-6 mb-3">
            <h5>Card name</h5>
            <input
              className="form-control"
              id="name"
              placeholder="Card name"
              onChange={handleNameChange}
              value={name}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleApplyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CardListFilters;
