import React from 'react';
import useThrottle from './useThrottle';

export interface PageList<T = any> {
  pageNum: number;
  background: string;
  component: (arg: T) => React.JSX.Element;
}

const useFullPage = (pageList: PageList[]) => {
  const [windowObj, setWindowObj] = React.useState<Window>();
  const [currentPageNum, setCurrentPageNum] = React.useState(1);
  const totalPageLen = pageList.length;
  const pageRefList = React.useRef<HTMLDivElement[]>([]);
  const [timestamp, setTimestamp] = React.useState(0);

  const currentPageChange = useThrottle(
    React.useCallback(
      (event: Event) => {
        let scroll = windowObj?.scrollY!;
        console.log('왜 실행됨?');
        for (let i = 1; i <= totalPageLen; i++) {
          if (
            scroll >
              pageRefList.current[i].offsetTop - windowObj!.outerHeight / 3 &&
            scroll <
              pageRefList.current[i].offsetTop -
                windowObj!.outerHeight / 3 +
                pageRefList.current[i].offsetHeight
          ) {
            setCurrentPageNum(i);
            break;
          }
        }
      },
      [totalPageLen, windowObj],
    ),
    500,
  );

  const pageButtonHandler = (pageNum: number) => {
    windowObj?.scrollTo({
      top: pageRefList.current[pageNum].offsetTop,
      behavior: 'smooth',
    });
  };

  const wheelHandler = React.useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      if (1000 > event.timeStamp - timestamp) return;

      if (event.deltaY < 0 && currentPageNum > 1) {
        windowObj?.scrollTo({
          top: pageRefList.current[currentPageNum - 1].offsetTop,
          behavior: 'smooth',
        });
        setTimestamp(event.timeStamp);
      }

      if (event.deltaY > 0 && currentPageNum < totalPageLen) {
        windowObj?.scrollTo({
          top: pageRefList.current[currentPageNum + 1].offsetTop,
          behavior: 'smooth',
        });
        setTimestamp(event.timeStamp);
      }
    },
    [currentPageNum, timestamp, totalPageLen, windowObj],
  );

  React.useEffect(() => {
    if (window !== undefined) setWindowObj(window);
  }, []);

  React.useEffect(() => {
    windowObj?.addEventListener('scroll', currentPageChange, { passive: true });
    return () => {
      windowObj?.removeEventListener('scroll', currentPageChange);
    };
  }, [currentPageChange, windowObj]);

  React.useEffect(() => {
    windowObj?.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      windowObj?.removeEventListener('wheel', wheelHandler);
    };
  }, [wheelHandler, windowObj]);

  return {
    pageButtonHandler,
    currentPageNum,
    pageRefList,
  };
};

export default useFullPage;
