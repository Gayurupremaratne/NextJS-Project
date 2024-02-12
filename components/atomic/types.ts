import { ComponentProps } from 'react';

export type ButtonNode = ComponentProps<'button'>;

export type ContainerNode = ComponentProps<'div'>;

export type TextNode = ComponentProps<'p'> & ComponentProps<'span'>;

export type LabelNode = ComponentProps<'span'>;

export type SpinnerTypes = 'primary' | 'secondary';

export type SpinnerSizes = 'xs' | 'sm' | 'md' | 'lg';

export type ChipNode = ComponentProps<'span'>;

export type TagNode = ComponentProps<'span'>;

export type HeadingNode = ComponentProps<'h1'> &
  ComponentProps<'h2'> &
  ComponentProps<'h3'> &
  ComponentProps<'h4'> &
  ComponentProps<'h5'> &
  ComponentProps<'h6'>;
