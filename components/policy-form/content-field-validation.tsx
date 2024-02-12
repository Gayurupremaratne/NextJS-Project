import * as yup from 'yup';

export const contentValidation = () => {
  return yup
    .string()
    .test(
      'content',
      'Content is required and should be between 1 and 2000 characters',
      function () {
        const { title, blocks } = this.parent;

        if (title && title.trim() !== '') {
          if (blocks && Array.isArray(blocks)) {
            const totalLength = blocks.reduce(
              (sum, block) => sum + block?.data?.text?.length,
              0,
            );

            if (blocks.length === 0) {
              return this.createError({
                message: 'Content is required',
              });
            }

            if (totalLength > 2000) {
              return this.createError({
                message: 'Content must not exceed 2000 characters',
              });
            }
          }
        }
        return true;
      },
    );
};
