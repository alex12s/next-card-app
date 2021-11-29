import React, { FC, useCallback, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { Card, CardType } from '../../types/Card';
import styles from './Card.module.scss';
import { useAppDispatch } from '../../app/hooks';
import { addCard } from './cardSlice';
import PrettyCard from '../../app/components/PrettyCard';
import { expDateSlashHandler } from '../../app/utils';

const CardForm: FC = () => {
  const inputRefs = useRef([]);
  const [cardType, setCardType] = useState<CardType>(null);
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    number: yup
      .array()
      .test({
        name: 'typeValidation',
        test: (v: string[]) => {
          const length = v.join('').length;
          if (cardType === CardType.visa) {
            return length === 13 || length === 16;
          }
          if (cardType === CardType.mastercard) {
            return length === 16;
          }
          // Card number validation is simplified a bit
          return length === 16;
        },
        message: 'Card number is invalid',
      })
      .test({
        name: 'required',
        test: (v: string[]) => {
          return v.join('').length > 0;
        },
        message: 'Card number is required',
      }),
    holder: yup.string().required('Holder name is required').min(4, 'Holder name must be longer than 4'),
    cvv: yup
      .string()
      .required('CVV is required')
      .min(3, 'CVV must contain 3 digits')
      .test({
        name: 'reg',
        test: (v: string) => /\d{3}/.test(v),
        message: 'CVV is invalid',
      }),
    expDate: yup
      .string()
      .required('Expiration date is required')
      .test({
        name: 'reg',
        test: (v: string) => {
          if (/\d{2}\/\d{2}/.test(v)) {
            const [vMonth, vYear] = v.split('/');
            const now = new Date();
            const year = now.getFullYear() - 2000;
            const month = now.getMonth() + 1;
            const isFutureDate = +vYear > year || (+vYear === year && +vMonth > month);
            const valid = +vYear < 2050 && +vMonth <= 12 && +vMonth >= 1;

            return valid && isFutureDate;
          }
          return false;
        },
        message: 'Expiration date is invalid',
      }),
  });

  const initialValues = {
    number: ['', '', '', ''],
    holder: '',
    cvv: '',
    expDate: '',
    name: '',
  };

  const checkCardType = (v: string[]) => {
    if (v[0] !== '' && v[0][0] === '4') {
      setCardType(CardType.visa);
    } else if (v[0] !== '' && /^(5[1-5]|2(22[1-9]|2[3-9]|[3-6]|7[0-1]|720))/.test(v[0])) {
      setCardType(CardType.mastercard);
    } else {
      setCardType(null);
    }
  };

  const handleNumberGroupChange = (i: number, setFieldValue, formValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '').substring(0, 4);

    const updatedValue = [...formValue];
    updatedValue.splice(i, 1, value);
    setFieldValue('number', updatedValue);
    checkCardType(updatedValue);

    if (value.length === 4) {
      const next = inputRefs.current[i + 1];
      if (next) {
        next.focus();
      }
    }

    if (value.length === 0) {
      const prev = inputRefs.current[i - 1];
      if (prev) {
        prev.focus();
      }
    }
  };

  const handleExpDateChange = (setFieldValue, formValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const value = expDateSlashHandler(newValue, formValue);
    setFieldValue('expDate', value);
  };

  const handleNumberGroupBackspace = (i: number, formValue) => (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      const prev = inputRefs.current[i - 1];

      if (prev && formValue[i] === '') {
        prev.focus();
      }
    }
  };

  const onNumberGroupPaste = (i: number, setFieldValue, formValue) => (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text');
    const cleanedUpValue = pasted.replace(/[^\d]/g, '').substring(0, 16);
    const pastedValues = cleanedUpValue.match(/\d{1,4}/g) || [];
    setFieldValue(
      'number',
      formValue.map((v, i) => pastedValues[i] || v)
    );
    const last = inputRefs.current[pastedValues.length - 1];
    if (last) {
      last.focus();
    }
  };

  const handleSubmit = useCallback(
    async (values: Record<string, any>, { resetForm, setErrors, setStatus, setSubmitting }) => {
      try {
        await dispatch(addCard({ ...values, number: values.number.join(''), type: cardType } as Card));
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        setCardType(null);
      } catch (e) {
        const message = e.message || 'Something went wrong';
        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    },
    [dispatch, cardType]
  );

  return (
    <div className="d-flex justify-content-center">
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={schema}>
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue, isValid }) => (
          <Form>
            <PrettyCard
              backsideContent={
                <Field name="cvv">
                  {({ field, form: { touched, errors } }) => (
                    <div className={`mb-3 ${styles.cvvGroup}`}>
                      <label htmlFor="cvv" className="form-label form-label-sm">
                        CVV*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="cvv"
                        placeholder=""
                        maxLength="3"
                        {...field}
                      />
                      {errors.cvv && touched.cvv && <div className={styles.error}>{errors.cvv}</div>}
                    </div>
                  )}
                </Field>
              }
            >
              <Field name="number">
                {({ field: { value, onBlur }, form: { touched, errors, setFieldValue } }) => (
                  <div className="mb-3 position-relative">
                    <label htmlFor="number0" className="form-label form-label-sm">
                      Card Number*
                    </label>
                    <div className="d-flex">
                      {value &&
                        value.map((v, i) => (
                          <input
                            key={`number${i}`}
                            type="text"
                            className={`form-control form-control-sm ${styles.numberInput}`}
                            id={`number${i}`}
                            placeholder=""
                            maxLength={4}
                            value={v}
                            onBlur={onBlur}
                            onChange={handleNumberGroupChange(i, setFieldValue, value)}
                            onKeyDown={handleNumberGroupBackspace(i, value)}
                            // onPaste={onNumberGroupPaste(i, setFieldValue, value)}
                            ref={(el) => (inputRefs.current[i] = el)}
                          />
                        ))}
                    </div>
                    {errors.number && touched.number0 && touched.number1 && touched.number2 && touched.number3 && (
                      <div className={`${styles.error} ${styles.errorPosition}`}>{errors.number}</div>
                    )}
                  </div>
                )}
              </Field>
              <Field name="expDate">
                {({ field: { value, onBlur }, form: { touched, errors, setFieldValue } }) => (
                  <div className="row">
                    <div className="mb-3 col-6 position-relative">
                      <label htmlFor="expDate" className="form-label form-label-sm">
                        Expiration Date*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="expDate"
                        placeholder="MM/YY"
                        value={value}
                        onBlur={onBlur}
                        onChange={handleExpDateChange(setFieldValue, value)}
                        maxLength={5}
                      />
                      {errors.expDate && touched.expDate && (
                        <div className={`${styles.error} ${styles.errorPosition}`}>{errors.expDate}</div>
                      )}
                    </div>
                  </div>
                )}
              </Field>
              <div className="row align-items-center">
                <Field name="holder">
                  {({ field, form: { touched, errors } }) => (
                    <div className="mb-3 col-9 position-relative">
                      <label htmlFor="holder" className="form-label form-label-sm">
                        Card Holder*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="holder"
                        placeholder=""
                        {...field}
                      />
                      {errors.holder && touched.holder && (
                        <div className={`${styles.error} ${styles.errorPosition}`}>{errors.holder}</div>
                      )}
                    </div>
                  )}
                </Field>
                <div className="col-3">
                  {cardType === CardType.mastercard && <img src="/m-logo.png" className={styles.logo} />}
                  {cardType === CardType.visa && <img src="/v-logo.png" className={styles.logo} />}
                </div>
              </div>
            </PrettyCard>
            <div className="container-fluid mb-3">
              <div className="row align-items-end">
                <Field name="name">
                  {({ field }) => (
                    <div className="col">
                      <label htmlFor="name" className="form-label">
                        Card Name
                      </label>
                      <div className="">
                        <input type="text" className="form-control" id="name" placeholder="" {...field} />
                      </div>
                    </div>
                  )}
                </Field>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary" disabled={!isValid || isSubmitting}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
            {errors.submit && (
              <div className="alert alert-danger" role="alert">
                {errors.submit}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CardForm;
