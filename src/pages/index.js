import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import shuffle from 'lodash/shuffle';
import Form from '../components/form';

const renderStaticFields = questions =>
  questions.map(({ node: question }) => {
    const { id, label } = question;

    return (
      <div key={id}>
        <label>{label}</label>
        <input type="text" name={id} readOnly />
      </div>
    );
  });

const Index = ({
  data: {
    allDynamicJson: { edges: dynamicQuestions },
    allSystemJson: { edges: systemQuestions },
  },
}) => {
  // Determine which random questions to show when component renders
  const randomQuestions = shuffle(dynamicQuestions).slice(0, 3);

  return (
    <div>
      <Form randomQuestions={randomQuestions} systemQuestions={systemQuestions} />
      {/*
        Static hidden form required for Netlify to recognise
        Must be rendered as part of the HTML (not by a React component)
        Name attribute values of fields here must match those in the React form
      */}
      <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input name="form-name" value="contact" readOnly />
        {renderStaticFields([...systemQuestions, ...randomQuestions])}
      </form>
    </div>
  );
};

Index.propTypes = {
  data: PropTypes.shape({
    allDynamicJson: PropTypes.object,
    allSystemJson: PropTypes.object,
  }).isRequired,
};

export const IndexQuery = graphql`
  query IndexQuery {
    allDynamicJson {
      edges {
        node {
          id
          label
          required
          type
        }
      }
    }
    allSystemJson {
      edges {
        node {
          id
          label
          required
          type
        }
      }
    }
  }
`;

export default Index;
