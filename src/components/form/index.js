import React from 'react';
import PropTypes from 'prop-types';
import DynamicQuestions from '../dynamic-questions';

/**
 * Encode the form data for POST to Netlify
 * See link in README.md for integrating forms in React and Netlify
 */
const encode = data =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

class Form extends React.Component {
  state = {};

  componentDidMount() {
    const { systemQuestions, randomQuestions } = this.props;

    const questions = [...systemQuestions, ...randomQuestions]
      .map(({ node }) => ({ ...node }))
      .reduce(
        (acc, { id, ...rest }) => ({
          ...acc,
          [id]: {
            value: '',
            invalid: false,
            ...rest,
          },
        }),
        {},
      );

    this.setState({
      questions,
    });
  }

  handleChange = ({ target: { value, name } }) => {
    this.setState({
      questions: {
        ...this.state.questions,
        [name]: {
          ...this.state.questions[name],
          value,
          invalid: !value,
        },
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const invalidQuestions = Object.entries(this.state.questions)
      .reduce((acc, [id, { required, value }]) => (required && !value ? [id, ...acc] : acc), [])
      .reduce(
        (acc, curr) => ({
          [curr]: {
            ...this.state.questions[curr],
            invalid: true,
          },
          ...acc,
        }),
        {},
      );

    this.setState({
      questions: {
        ...this.state.questions,
        ...invalidQuestions,
      },
    });

    if (!Object.entries(invalidQuestions).length) {
      const formValues = Object.entries(this.state.questions).reduce(
        (acc, [id, { value }]) => ({
          [id]: value,
          ...acc,
        }),
        {},
      );

      const body = encode({ 'form-name': 'contact', ...formValues });

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
        .then(() => alert('Success! Check your network'))
        .catch(error => alert(error));
    }
  };

  renderFields = questions => (
    <DynamicQuestions questions={questions} handleChange={this.handleChange} />
  );

  render() {
    const { questions } = this.state;

    return (
      <div>
        {questions && (
          <form
            name="contact"
            method="post"
            action="success/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={this.handleSubmit}
          >
            <div>
              <h1>Random Questions Form</h1>
              <input type="hidden" name="bot-field" />
              <input type="hidden" name="form-name" value="contact" />
              {this.renderFields(questions)}
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        )}
      </div>
    );
  }
}

Form.propTypes = {
  systemQuestions: PropTypes.array,
  randomQuestions: PropTypes.array,
};

export default Form;
