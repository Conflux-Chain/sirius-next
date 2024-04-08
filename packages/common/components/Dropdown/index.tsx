import qs from "qs";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useClickAway } from "@cfx-kit/react-utils/dist/hooks.js";
import clsx from "clsx";
import Button from "../Button";

// options example:
// [
//   {
//     key: 'txType',
//     value: 'all',
//     name: 'viewAll',
//   },
//   {
//     key: 'txType',
//     value: 'outgoing',
//     name: 'viewOutgoingTxns',
//   },
//   {
//     key: 'txType',
//     value: 'incoming',
//     name: 'viewIncomingTxns',
//   },
//   {
//     key: 'txType',
//     value: '1',
//     name: 'failed txns',
//   },
// ];

export const TableSearchDropdown = ({
  options = [],
  onChange,
}: {
  options?: Array<{
    key: string;
    value: string;
    name: string;
  }>;
  onChange?: (value: string) => void;
}) => {
  const history = useHistory();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  useClickAway(dropdownRef, () => visible && setVisible(false));

  let keyList = options.reduce((prev, curr) => {
    return prev.concat(curr.key);
  }, [] as Array<string>);
  // @ts-ignore
  keyList = [...new Set(keyList)];

  useEffect(() => {
    const query = qs.parse(location.search || "", {
      ignoreQueryPrefix: true,
    });
    const realValue2 = options.reduce((prev, curr, index) => {
      if (query[curr.key] === curr.value) {
        return index;
      }
      return prev;
    }, 0);
    setSelected(realValue2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleClick = (index: number) => {
    setVisible(false);

    const option = options[index];
    if (!option) return;

    if (onChange) {
      onChange(option.value);
    } else {
      let { skip, ...query } = qs.parse(location.search || "", {
        ignoreQueryPrefix: true,
      });
      let queryValue = "";

      keyList.forEach((k) => {
        if (k === option.key) {
          queryValue = query[k] as string;
        }
        delete query[k];
      });

      if (queryValue !== option.value) {
        query[option.key] = option.value;
        history.push(
          `${location.pathname}${qs.stringify(
            {
              skip: "0",
              ...query,
            },
            {
              addQueryPrefix: true,
            }
          )}`
        );
      }
    }
  };

  return (
    <div className="relative inline-block ml-0.5714rem">
      <Button type="icon" onClick={() => setVisible(!visible)}>
        <span className="i-material-symbols:more-horiz text-18px"></span>
      </Button>
      {visible && (
        <div
          className={clsx(
            "option-container",
            "absolute right-0 rounded-0.14rem bg-#fff w-max mt-0.7143rem z-10 lt-sm:right-unset lt-sm:left-0"
          )}
          style={{
            boxShadow: "0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08)",
          }}
          ref={dropdownRef}
        >
          {options.map((o, index) => (
            <div
              key={o.value}
              onClick={() => handleClick(index)}
              className={clsx(
                "opt",
                "flex-vertical-center justify-between lh-1.57rem py-0.29rem px-1.14rem cursor-pointer hover:bg-#f1f4f6",
                selected === index
                  ? "text-[var(--theme-color-primary)]"
                  : "text-#65709a"
              )}
            >
              <span>{o.name}</span>
              {selected === index && (
                <span className="i-material-symbols:check-small-rounded text-28px ml-0.5rem"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
