import { Injectable } from '@angular/core';
import { ButtonColor, ButtonSize } from './button.domain';

@Injectable()
export class ButtonService {
  setClasses(color: ButtonColor, size: ButtonSize) {
    const classes = [];

    if (color === 'primary') {
      classes.push(
        'bg-gray-600 hover:bg-gray-700 active:bg-gray-900 disabled:hover:bg-gray-600 disabled:active:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500 dark:active:bg-gray-600 ',
      );
    } else if (color === 'secondary') {
      classes.push(
        'bg-inherit text-gray-300 hover:bg-gray-500 hover:text-white active:bg-gray-800 disabled:hover:bg-gray-500 disabled:hover:text-gray-300 dark:bg-inherit dark:text-gray-500 dark:hover:bg-gray-300 dark:hover:text-gray-100 dark:active:bg-gray-200 ',
      );
    } else if (color === 'danger') {
      classes.push(
        'bg-red-600 hover:bg-red-800 active:bg-red-900 disabled:hover:bg-red-600 disabled:active:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700 ',
      );
    }

    if (size === 'small') {
      classes.push(' gap-2 px-2 py-1 text-sm');
    } else if (size === 'medium') {
      classes.push(' gap-4 px-4 py-2 text-base');
    } else if (size === 'large') {
      classes.push(' gap-6 px-6 py-3 text-lg');
    }

    return classes.join(' ');
  }
}
