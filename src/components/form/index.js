import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
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

  dynamicSchema = {};

  componentDidMount() {
    const { systemQuestions, randomQuestions } = this.props;

    const questionConfig = [...systemQuestions, ...randomQuestions];

    const questionsSchema = questionConfig
      .map(({ node }) => ({ ...node }))
      .reduce(
        (acc, { id, required }) => ({
          ...acc,
          ...(required && {
            [id]: Yup.object().shape({
              value: Yup.string('Enter a string').required('This is required'),
            }),
          }),
        }),
        {},
      );

    this.dynamicSchema = Yup.object().shape(questionsSchema);

    const stateQuestions = questionConfig
      .map(({ node }) => ({ ...node }))
      .reduce(
        (acc, { id, ...rest }) => ({
          ...acc,
          [id]: {
            value: '',
            errorMessage: '',
            ...rest,
          },
        }),
        {},
      );

    this.setState({
      questions: stateQuestions,
    });
  }

  handleChange = ({ target: { value, name } }) => {
    this.setState({
      questions: {
        ...this.state.questions,
        [name]: {
          ...this.state.questions[name],
          value,
          errorMessage: '',
        },
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    await this.dynamicSchema
      .validate(this.state.questions, {
        abortEarly: false,
      })
      .then(() => {
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
      })
      .catch((err) => {
        err.inner.map((fieldErrorObject) => {
          const fieldName = fieldErrorObject.params.path.split('.')[0];

          this.setState({
            questions: {
              ...this.state.questions,
              [fieldName]: {
                ...this.state.questions[fieldName],
                errorMessage: fieldErrorObject.message,
              },
            },
          });
        });
      });
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
