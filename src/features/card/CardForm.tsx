import React, { FC, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { CardType } from '../../types/Card';
import styles from './Card.module.css';

const CardForm: FC = () => {
  const inputRefs = useRef([]);
  const [cardType, setCardType] = useState<CardType>(null);

  const schema = yup.object().shape({
    number: yup
      .array()
      .test({
        name: 'typeValidation',
        test: (v: string[]) => {
          // For now works only with Visa or Mastercard
          const length = v.join('').length;
          if (cardType === CardType.visa) {
            return length === 13 || length === 16;
          }
          if (cardType === CardType.mastercard) {
            return length === 16;
          }
          return false;
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

  const onNumberGroupChange = (i: number, setFieldValue, formValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const onNumberGroupBackspace = (i: number, formValue) => (e: React.KeyboardEvent) => {
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

  // const onSubmit = ({values, formikHelpers}: {values: any, formikHelpers: FormikHelpers<any>}) => {
  //   console.log("submit!", values);
  // }

  return (
    <div className={styles.formWrapper}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikBag) => {
          console.log('submit', JSON.stringify(values, null, 2));
          formikBag.resetForm();
        }}
        validationSchema={schema}
        // validateOnChange={false}
        // validateOnBlur={false}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue, isValid }) => (
          <Form>
            <div className={`${styles.creditCard} ${styles.creditCardFrontSide}`}>
              <Field name="number" /*validate={validateEmail}*/>
                {({ field: { name, value, onChange, onBlur }, form: { touched, errors, setFieldValue } }) => (
                  <div className="mb-4 position-relative">
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
                            onChange={onNumberGroupChange(i, setFieldValue, value)}
                            onKeyDown={onNumberGroupBackspace(i, value)}
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
                {({ field, form: { touched, errors } }) => (
                  <div className="row">
                    <div className="mb-4 col-5 position-relative">
                      <label htmlFor="expDate" className="form-label form-label-sm">
                        Expiration Date*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="expDate"
                        placeholder="MM/YY"
                        {...field}
                        maxLength="5"
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
                    <div className="mb-4 col-9 position-relative">
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
            </div>
            <div
              className={`${styles.creditCard} ${styles.creditCardBackSide} d-flex justify-content-end align-items-baseline`}
            >
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
            </div>
            <div className="row">
              <Field name="name">
                {({ field }) => (
                  <>
                    <label htmlFor="name" className="form-label col-3">
                      Card Name
                    </label>
                    <div className="col-6">
                      <input type="text" className="form-control" id="name" placeholder="" {...field} />
                    </div>
                  </>
                )}
              </Field>
              <button type="submit" className="btn btn-primary col-3" disabled={!isValid || isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CardForm;
