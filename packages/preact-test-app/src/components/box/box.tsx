import { Fragment, FunctionComponent, h, AnyComponent, JSX } from 'preact';

import './box.css';

interface BoxProps {
  headline?: JSX.Element | string;
  subheadline?: JSX.Element | string;
}

export const Box: FunctionComponent<BoxProps> = ({
  children,
  headline,
  subheadline,
}) => {
  return (
    <article className='box'>
      <header className="box-header">
        {headline && <h2 class="box-headline">{headline}</h2>}
        {subheadline && <h4 className="box-subheadline">{subheadline}</h4>}
      </header>
      <main>{children}</main>
    </article>
  );
};
