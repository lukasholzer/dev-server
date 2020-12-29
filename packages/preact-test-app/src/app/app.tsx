// import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Fragment, h } from 'preact';
import { Box } from '../components/box/box';

// import './app.css'

// dayjs.extend(updateLocale);
// dayjs.updateLocale('en', {
//   weekdays: [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//   ],
// });

export function App() {
  const dateString = 'asdf'; // dayjs().format('MMMM, D dddd');
  return (
    <>
      <Box headline="Today's schedule" subheadline={dateString}>
        My box text
      </Box>
    </>
  );
}
