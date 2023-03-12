import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';

export const formValidatorProvider = {
  provide: TUI_VALIDATION_ERRORS,
  useValue: {
    required: 'Поле обязательно к заполнению',
    email: 'Некорректный email'
  }
};
