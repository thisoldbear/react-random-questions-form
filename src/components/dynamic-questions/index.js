import React from 'react';
import PropTypes from 'prop-types';

const fieldStyle = {
  margin: '0 0 20px 0',
};

const errorStyle = {
  color: 'red',
};

const renderDynamicQuestions = (questions, handleChange) =>
  Object.entries(questions).map((question) => {
    const [id, {
      label, required, value, errorMessage,
    }] = question;
    return (
      <div key={id} style={fieldStyle}>
        <div>
          <label htmlFor={id}>
            {label}
            {required && <span style={errorStyle}>*</span>}
          </label>
        </div>
        <input type="text" name={id} onChange={handleChange} value={value} />
        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
      </div>
    );
  });

const DynamicQuestions = ({ questions, handleChange }) =>
  renderDynamicQuestions(questions, handleChange);

DynamicQuestions.propTypes = {
  questions: PropTypes.object,
  handleChange: PropTypes.func,
};

export default DynamicQuestions;
