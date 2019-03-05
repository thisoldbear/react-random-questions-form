import * as Yup from 'yup';

export const createFieldSchema = (type, required) => {
  const decorate = schema => (required ? schema.required('Required') : schema);

  switch (type) {
    case 'email': {
      const emailSchema = Yup.string().email('Please enter a valid email');
      return decorate(emailSchema);
    }
    case 'text': {
      const textSchema = Yup.string();
      return decorate(textSchema);
    }
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
        [id]: Yup.object().shape({
          value: createFieldSchema(type, required),
        }),
      }),
      {},
    );
