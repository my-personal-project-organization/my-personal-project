export type IconName =
  | 'github'
  | 'home'
  | 'user'
  | 'search'
  | 'menu'
  | 'close'
  | 'plus'
  | 'minus'
  | 'edit'
  | 'delete'
  | 'check'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'refresh'
  | 'download'
  | 'upload'
  | 'save'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'settings'
  | 'mail'
  | 'phone'
  | 'location'
  | 'link'
  | 'calendar'
  | 'clock'
  | 'image';
export type IconSize = number | `${number}rem`;

export interface IconDefinition {
  name: IconName;
  svg: string;
}
