import * as Yup from 'yup';

export const createFieldSchema = (type) => {
  switch (type) {
    case 'email':
      return Yup.string()
        .email('Please enter a valid email')
        .required('Please enter an email');

    case 'text':
      return Yup.string().required('This is required');

    default:
      return '';
  }
};

export const createMainSchema = questionConfig =>
  questionConfig
    .map(({ node }) => ({ ...node }))
    .reduce(
      (acc, { id, required, type }) => ({
        ...acc,
        ...(required && {
          [id]: Yup.object().shape({
            value: createFieldSchema(type),
          }),
        }),
      }),
      {},
    );
