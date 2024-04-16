// ../../node_modules/.pnpm/@cfx-kit+ui-components@0.0.17_@zag-js+accordion@0.19.1_@zag-js+checkbox@0.19.1_@zag-js+dialog_fmko2yy6bkfybbxu2fwkms7fpm/node_modules/@cfx-kit/ui-components/dist/chunk-G2ADBYYC.js
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b) => __defProps(a2, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// ../../node_modules/.pnpm/@cfx-kit+ui-components@0.0.17_@zag-js+accordion@0.19.1_@zag-js+checkbox@0.19.1_@zag-js+dialog_fmko2yy6bkfybbxu2fwkms7fpm/node_modules/@cfx-kit/ui-components/dist/Tooltip.js
import { useEffect as useEffect3, useId, isValidElement, cloneElement, Children } from "react";

// ../../node_modules/.pnpm/@zag-js+anatomy@0.19.1/node_modules/@zag-js/anatomy/dist/index.mjs
var createAnatomy = (name, parts2 = []) => ({
  parts: (...values) => {
    if (isEmpty(parts2)) {
      return createAnatomy(name, values);
    }
    throw new Error("createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?");
  },
  extendWith: (...values) => createAnatomy(name, [...parts2, ...values]),
  rename: (newName) => createAnatomy(newName, parts2),
  keys: () => parts2,
  build: () => [...new Set(parts2)].reduce(
    (prev, part) => Object.assign(prev, {
      [part]: {
        selector: [
          `&[data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`,
          `& [data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`
        ].join(", "),
        attrs: { "data-scope": toKebabCase(name), "data-part": toKebabCase(part) }
      }
    }),
    {}
  )
});
var toKebabCase = (value) => value.replace(/([A-Z])([A-Z])/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
var isEmpty = (v) => v.length === 0;

// ../../node_modules/.pnpm/@zag-js+dom-query@0.19.1/node_modules/@zag-js/dom-query/dist/index.mjs
var dataAttr = (guard) => {
  return guard ? "" : void 0;
};
function isHTMLElement(value) {
  return typeof value === "object" && value?.nodeType === Node.ELEMENT_NODE && typeof value?.nodeName === "string";
}
var getDocument = (node) => {
  if (node.nodeType === Node.DOCUMENT_NODE)
    return node;
  return node.ownerDocument ?? document;
};
function createScope(methods) {
  const screen = {
    getRootNode: (ctx) => ctx.getRootNode?.() ?? document,
    getDoc: (ctx) => getDocument(screen.getRootNode(ctx)),
    getWin: (ctx) => screen.getDoc(ctx).defaultView ?? window,
    getActiveElement: (ctx) => screen.getDoc(ctx).activeElement,
    getById: (ctx, id) => screen.getRootNode(ctx).getElementById(id),
    setValue: (elem, value) => {
      if (elem == null || value == null)
        return;
      elem.value = value.toString();
    }
  };
  return { ...screen, ...methods };
}
function isScrollParent(el) {
  const win = el.ownerDocument.defaultView || window;
  const { overflow, overflowX, overflowY } = win.getComputedStyle(el);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getParent(el) {
  if (el.localName === "html")
    return el;
  return el.assignedSlot || el.parentElement || el.ownerDocument.documentElement;
}
function getScrollParent(el) {
  if (["html", "body", "#document"].includes(el.localName)) {
    return el.ownerDocument.body;
  }
  if (isHTMLElement(el) && isScrollParent(el)) {
    return el;
  }
  return getScrollParent(getParent(el));
}
function getScrollParents(el, list = []) {
  const parent = getScrollParent(el);
  const isBody = parent === el.ownerDocument.body;
  const win = parent.ownerDocument.defaultView || window;
  const target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(parent) ? parent : []) : parent;
  const parents = list.concat(target);
  return isBody ? parents : parents.concat(getScrollParents(getParent(target)));
}
var isDom = () => typeof document !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
var pt = (v) => isDom() && v.test(getPlatform());
var vn = (v) => isDom() && v.test(navigator.vendor);
var isSafari = () => isApple() && vn(/apple/i);
var isApple = () => pt(/mac|iphone|ipad|ipod/i);
function raf(fn) {
  const id = globalThis.requestAnimationFrame(fn);
  return () => {
    globalThis.cancelAnimationFrame(id);
  };
}

// ../../node_modules/.pnpm/@floating-ui+utils@0.2.1/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

// ../../node_modules/.pnpm/@floating-ui+core@1.6.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y: y2
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y: y2,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y2 = nextY != null ? nextY : y2;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y: y2
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x,
    y: y2,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y: y2,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y: y2
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var arrow = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y: y2,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y: y2
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max3 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max3);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max3 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a2, b) => a2.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b) => a2[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y: y2,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y2 + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y: y2,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y3
            } = _ref;
            return {
              x: x2,
              y: y3
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y: y2
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min3 = mainAxisCoord + overflow[minSide];
        const max3 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min3, mainAxisCoord, max3);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min3 = crossAxisCoord + overflow[minSide];
        const max3 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min3, crossAxisCoord, max3);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y2
        }
      };
    }
  };
};
var size = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const overflowAvailableHeight = height - overflow[heightSide];
      const overflowAvailableWidth = width - overflow[widthSide];
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        const maximumClippingWidth = width - overflow.left - overflow.right;
        availableWidth = alignment || noShift ? min(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
      } else {
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        availableHeight = alignment || noShift ? min(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

// ../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min2 = Math.min;
var max2 = Math.max;
var round = Math.round;
var createCoords = (v) => ({
  x: v,
  y: v
});

// ../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement2(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement2(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement2(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}

// ../../node_modules/.pnpm/@floating-ui+dom@1.5.1/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement2(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement2(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y2 = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y2 || !Number.isFinite(y2)) {
    y2 = 1;
  }
  return {
    x,
    y: y2
  };
}
var noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y2 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y2 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y2 += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y: y2
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement2(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement2(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max2(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max2(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y2 = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x += max2(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y: y2
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y: y2
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement2(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y2 = top * scale.y;
  return {
    width,
    height,
    x,
    y: y2
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max2(rect.top, accRect.top);
    accRect.right = min2(rect.right, accRect.right);
    accRect.bottom = min2(rect.bottom, accRect.bottom);
    accRect.left = max2(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement2(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement2(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement2(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
var getElementRects = async function(_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...await getDimensionsFn(floating)
    }
  };
};
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// ../../node_modules/.pnpm/@zag-js+utils@0.19.1/node_modules/@zag-js/utils/dist/index.mjs
var callAll = (...fns) => (...a2) => {
  fns.forEach(function(fn) {
    fn?.(...a2);
  });
};
function compact(obj) {
  if (!isPlainObject(obj) || obj === void 0) {
    return obj;
  }
  const keys = Reflect.ownKeys(obj).filter((key) => typeof key === "string");
  const filtered = {};
  for (const key of keys) {
    const value = obj[key];
    if (value !== void 0) {
      filtered[key] = compact(value);
    }
  }
  return filtered;
}
var isPlainObject = (value) => {
  return value && typeof value === "object" && value.constructor === Object;
};

// ../../node_modules/.pnpm/@zag-js+element-rect@0.19.1/node_modules/@zag-js/element-rect/dist/index.mjs
var rafId;
var observedElements = /* @__PURE__ */ new Map();
var getRectFn = (el) => el.getBoundingClientRect();
function trackElementRect(el, options) {
  const { scope = "rect", getRect = getRectFn, onChange } = options;
  const loop = getLoopFn({ scope, getRect });
  const data = observedElements.get(el);
  if (!data) {
    observedElements.set(el, {
      rect: {},
      callbacks: [onChange]
    });
    if (observedElements.size === 1) {
      rafId = requestAnimationFrame(loop);
    }
  } else {
    data.callbacks.push(onChange);
    onChange(getRect(el));
  }
  return function unobserve() {
    const data2 = observedElements.get(el);
    if (!data2)
      return;
    const index = data2.callbacks.indexOf(onChange);
    if (index > -1) {
      data2.callbacks.splice(index, 1);
    }
    if (data2.callbacks.length === 0) {
      observedElements.delete(el);
      if (observedElements.size === 0) {
        cancelAnimationFrame(rafId);
      }
    }
  };
}
function getLoopFn(options) {
  const { scope, getRect } = options;
  const isEqual = getEqualityFn(scope);
  return function loop() {
    const changedRectsData = [];
    observedElements.forEach((data, element) => {
      const newRect = getRect(element);
      if (!isEqual(data.rect, newRect)) {
        data.rect = newRect;
        changedRectsData.push(data);
      }
    });
    changedRectsData.forEach((data) => {
      data.callbacks.forEach((callback) => callback(data.rect));
    });
    rafId = requestAnimationFrame(loop);
  };
}
var isEqualSize = (a2, b) => a2.width === b.width && a2.height === b.height;
var isEqualPosition = (a2, b) => a2.top === b.top && a2.left === b.left;
var isEqualRect = (a2, b) => isEqualSize(a2, b) && isEqualPosition(a2, b);
function getEqualityFn(scope) {
  if (scope === "size")
    return isEqualSize;
  if (scope === "position")
    return isEqualPosition;
  return isEqualRect;
}

// ../../node_modules/.pnpm/@zag-js+popper@0.19.1/node_modules/@zag-js/popper/dist/index.mjs
var callAll2 = (...fns) => () => fns.forEach((fn) => fn());
var isHTMLElement3 = (el) => {
  return typeof el === "object" && el !== null && el.nodeType === 1;
};
var addDomEvent = (el, type, fn, options) => {
  el.addEventListener(type, fn, options);
  return () => el.removeEventListener(type, fn, options);
};
function resolveOptions(option) {
  const bool = typeof option === "boolean";
  return {
    ancestorResize: bool ? option : option.ancestorResize ?? true,
    ancestorScroll: bool ? option : option.ancestorScroll ?? true,
    referenceResize: bool ? option : option.referenceResize ?? true
  };
}
function autoUpdate(reference, floating, update, options = false) {
  const { ancestorScroll, ancestorResize, referenceResize } = resolveOptions(options);
  const useAncestors = ancestorScroll || ancestorResize;
  const ancestors = [];
  if (useAncestors && isHTMLElement3(reference)) {
    ancestors.push(...getOverflowAncestors(reference));
  }
  function addResizeListeners() {
    let cleanups = [trackElementRect(floating, { scope: "size", onChange: update })];
    if (referenceResize && isHTMLElement3(reference)) {
      cleanups.push(trackElementRect(reference, { onChange: update }));
    }
    cleanups.push(callAll2(...ancestors.map((el) => addDomEvent(el, "resize", update))));
    return () => cleanups.forEach((fn) => fn());
  }
  function addScrollListeners() {
    return callAll2(...ancestors.map((el) => addDomEvent(el, "scroll", update, { passive: true })));
  }
  return callAll2(addResizeListeners(), addScrollListeners());
}
var toVar = (value) => ({ variable: value, reference: `var(${value})` });
var cssVars = {
  arrowSize: toVar("--arrow-size"),
  arrowSizeHalf: toVar("--arrow-size-half"),
  arrowBg: toVar("--arrow-background"),
  transformOrigin: toVar("--transform-origin"),
  arrowOffset: toVar("--arrow-offset")
};
var getTransformOrigin = (arrow2) => ({
  top: "bottom center",
  "top-start": arrow2 ? `${arrow2.x}px bottom` : "left bottom",
  "top-end": arrow2 ? `${arrow2.x}px bottom` : "right bottom",
  bottom: "top center",
  "bottom-start": arrow2 ? `${arrow2.x}px top` : "top left",
  "bottom-end": arrow2 ? `${arrow2.x}px top` : "top right",
  left: "right center",
  "left-start": arrow2 ? `right ${arrow2.y}px` : "right top",
  "left-end": arrow2 ? `right ${arrow2.y}px` : "right bottom",
  right: "left center",
  "right-start": arrow2 ? `left ${arrow2.y}px` : "left top",
  "right-end": arrow2 ? `left ${arrow2.y}px` : "left bottom"
});
var transformOrigin = {
  name: "transformOrigin",
  fn({ placement, elements, middlewareData }) {
    const { arrow: arrow2 } = middlewareData;
    const transformOrigin2 = getTransformOrigin(arrow2)[placement];
    const { floating } = elements;
    floating.style.setProperty(cssVars.transformOrigin.variable, transformOrigin2);
    return {
      data: { transformOrigin: transformOrigin2 }
    };
  }
};
var shiftArrow = (opts) => ({
  name: "shiftArrow",
  fn({ placement, middlewareData }) {
    const { element: arrow2 } = opts;
    if (middlewareData.arrow) {
      const { x, y: y2 } = middlewareData.arrow;
      const dir = placement.split("-")[0];
      Object.assign(arrow2.style, {
        left: x != null ? `${x}px` : "",
        top: y2 != null ? `${y2}px` : "",
        [dir]: `calc(100% + ${cssVars.arrowOffset.reference})`
      });
    }
    return {};
  }
});
var defaultOptions = {
  strategy: "absolute",
  placement: "bottom",
  listeners: true,
  gutter: 8,
  flip: true,
  sameWidth: false,
  overflowPadding: 8
};
function getPlacementImpl(reference, floating, opts = {}) {
  if (!floating || !reference)
    return;
  const options = Object.assign({}, defaultOptions, opts);
  const arrowEl = floating.querySelector("[data-part=arrow]");
  const middleware = [];
  const boundary = typeof options.boundary === "function" ? options.boundary() : options.boundary;
  if (options.flip) {
    middleware.push(
      flip({
        boundary,
        padding: options.overflowPadding
      })
    );
  }
  if (options.gutter || options.offset) {
    const arrowOffset = arrowEl ? arrowEl.offsetHeight / 2 : 0;
    let mainAxis = options.offset?.mainAxis ?? options.gutter;
    let crossAxis = options.offset?.crossAxis;
    if (mainAxis != null)
      mainAxis += arrowOffset;
    const offsetOptions = compact({ mainAxis, crossAxis });
    middleware.push(offset(offsetOptions));
  }
  middleware.push(
    shift({
      boundary,
      crossAxis: options.overlap,
      padding: options.overflowPadding
    })
  );
  if (arrowEl) {
    middleware.push(
      arrow({ element: arrowEl, padding: 8 }),
      shiftArrow({ element: arrowEl })
    );
  }
  middleware.push(transformOrigin);
  middleware.push(
    size({
      padding: options.overflowPadding,
      apply({ rects, availableHeight, availableWidth }) {
        const referenceWidth = Math.round(rects.reference.width);
        floating.style.setProperty("--reference-width", `${referenceWidth}px`);
        floating.style.setProperty("--available-width", `${availableWidth}px`);
        floating.style.setProperty("--available-height", `${availableHeight}px`);
      }
    })
  );
  function compute(config = {}) {
    if (!reference || !floating)
      return;
    const { placement, strategy, onComplete } = options;
    computePosition2(reference, floating, {
      placement,
      middleware,
      strategy,
      ...config
    }).then((data) => {
      const x = Math.round(data.x);
      floating.style.setProperty("--x", `${x}px`);
      const y2 = Math.round(data.y);
      floating.style.setProperty("--y", `${y2}px`);
      onComplete?.(data);
    });
  }
  compute();
  return callAll(
    options.listeners ? autoUpdate(reference, floating, compute, options.listeners) : void 0,
    options.onCleanup
  );
}
function getPlacement(referenceOrFn, floatingOrFn, opts = {}) {
  const { defer, ...restOptions } = opts;
  const func = defer ? raf : (v) => v();
  const cleanups = [];
  cleanups.push(
    func(() => {
      const reference = typeof referenceOrFn === "function" ? referenceOrFn() : referenceOrFn;
      const floating = typeof floatingOrFn === "function" ? floatingOrFn() : floatingOrFn;
      cleanups.push(getPlacementImpl(reference, floating, restOptions));
    })
  );
  return () => {
    cleanups.forEach((fn) => fn?.());
  };
}
var ARROW_FLOATING_STYLE = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  top: "rotate(225deg)",
  right: "rotate(315deg)"
};
function getPlacementStyles(options = {}) {
  const { placement = "bottom", sameWidth, fitViewport, strategy = "absolute" } = options;
  return {
    arrow: {
      position: "absolute",
      width: cssVars.arrowSize.reference,
      height: cssVars.arrowSize.reference,
      [cssVars.arrowSizeHalf.variable]: `calc(${cssVars.arrowSize.reference} / 2)`,
      [cssVars.arrowOffset.variable]: `calc(${cssVars.arrowSizeHalf.reference} * -1)`
    },
    arrowTip: {
      transform: ARROW_FLOATING_STYLE[placement.split("-")[0]],
      background: cssVars.arrowBg.reference,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: "inherit"
    },
    floating: {
      position: strategy,
      minWidth: sameWidth ? void 0 : "max-content",
      width: sameWidth ? "var(--reference-width)" : void 0,
      maxWidth: fitViewport ? "var(--available-width)" : void 0,
      maxHeight: fitViewport ? "var(--available-height)" : void 0,
      top: "0px",
      left: "0px",
      transform: `translate3d(var(--x), var(--y), 0)`
    }
  };
}

// ../../node_modules/.pnpm/proxy-compare@2.5.1/node_modules/proxy-compare/dist/index.modern.js
var e = Symbol();
var t = Symbol();
var r = "a";
var n = "w";
var o = (e2, t2) => new Proxy(e2, t2);
var s = Object.getPrototypeOf;
var c = /* @__PURE__ */ new WeakMap();
var l = (e2) => e2 && (c.has(e2) ? c.get(e2) : s(e2) === Object.prototype || s(e2) === Array.prototype);
var f = (e2) => "object" == typeof e2 && null !== e2;
var i = (e2) => {
  if (Array.isArray(e2))
    return Array.from(e2);
  const t2 = Object.getOwnPropertyDescriptors(e2);
  return Object.values(t2).forEach((e3) => {
    e3.configurable = true;
  }), Object.create(s(e2), t2);
};
var u = (e2) => e2[t] || e2;
var a = (s2, c2, f2, p2) => {
  if (!l(s2))
    return s2;
  let g = p2 && p2.get(s2);
  if (!g) {
    const e2 = u(s2);
    g = ((e3) => Object.values(Object.getOwnPropertyDescriptors(e3)).some((e4) => !e4.configurable && !e4.writable))(e2) ? [e2, i(e2)] : [e2], null == p2 || p2.set(s2, g);
  }
  const [y2, h2] = g;
  let w = f2 && f2.get(y2);
  return w && w[1].f === !!h2 || (w = ((o2, s3) => {
    const c3 = { f: s3 };
    let l2 = false;
    const f3 = (e2, t2) => {
      if (!l2) {
        let s4 = c3[r].get(o2);
        if (s4 || (s4 = {}, c3[r].set(o2, s4)), e2 === n)
          s4[n] = true;
        else {
          let r2 = s4[e2];
          r2 || (r2 = /* @__PURE__ */ new Set(), s4[e2] = r2), r2.add(t2);
        }
      }
    }, i2 = { get: (e2, n2) => n2 === t ? o2 : (f3("k", n2), a(Reflect.get(e2, n2), c3[r], c3.c, c3.t)), has: (t2, n2) => n2 === e ? (l2 = true, c3[r].delete(o2), true) : (f3("h", n2), Reflect.has(t2, n2)), getOwnPropertyDescriptor: (e2, t2) => (f3("o", t2), Reflect.getOwnPropertyDescriptor(e2, t2)), ownKeys: (e2) => (f3(n), Reflect.ownKeys(e2)) };
    return s3 && (i2.set = i2.deleteProperty = () => false), [i2, c3];
  })(y2, !!h2), w[1].p = o(h2 || y2, w[0]), f2 && f2.set(y2, w)), w[1][r] = c2, w[1].c = f2, w[1].t = p2, w[1].p;
};
var p = (e2, t2, r2, o2) => {
  if (Object.is(e2, t2))
    return false;
  if (!f(e2) || !f(t2))
    return true;
  const s2 = r2.get(u(e2));
  if (!s2)
    return true;
  if (o2) {
    const r3 = o2.get(e2);
    if (r3 && r3.n === t2)
      return r3.g;
    o2.set(e2, { n: t2, g: false });
  }
  let c2 = null;
  try {
    for (const r3 of s2.h || [])
      if (c2 = Reflect.has(e2, r3) !== Reflect.has(t2, r3), c2)
        return c2;
    if (true === s2[n]) {
      if (c2 = ((e3, t3) => {
        const r3 = Reflect.ownKeys(e3), n2 = Reflect.ownKeys(t3);
        return r3.length !== n2.length || r3.some((e4, t4) => e4 !== n2[t4]);
      })(e2, t2), c2)
        return c2;
    } else
      for (const r3 of s2.o || [])
        if (c2 = !!Reflect.getOwnPropertyDescriptor(e2, r3) != !!Reflect.getOwnPropertyDescriptor(t2, r3), c2)
          return c2;
    for (const n2 of s2.k || [])
      if (c2 = p(e2[n2], t2[n2], r2, o2), c2)
        return c2;
    return null === c2 && (c2 = true), c2;
  } finally {
    o2 && o2.set(e2, { n: t2, g: c2 });
  }
};
var y = (e2) => l(e2) && e2[t] || null;
var h = (e2, t2 = true) => {
  c.set(e2, t2);
};

// ../../node_modules/.pnpm/@zag-js+store@0.19.1/node_modules/@zag-js/store/dist/index.mjs
var isDev = process.env.NODE_ENV !== "production";
var isObject = (x) => typeof x === "object" && x !== null;
var proxyStateMap = /* @__PURE__ */ new WeakMap();
var refSet = /* @__PURE__ */ new WeakSet();
var buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
  switch (promise.status) {
    case "fulfilled":
      return promise.value;
    case "rejected":
      throw promise.reason;
    default:
      throw promise;
  }
}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
  const cache = snapCache.get(target);
  if (cache?.[0] === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  h(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    const value = Reflect.get(target, key);
    if (refSet.has(value)) {
      h(value, false);
      snap[key] = value;
    } else if (value instanceof Promise) {
      Object.defineProperty(snap, key, {
        get() {
          return handlePromise(value);
        }
      });
    } else if (proxyStateMap.has(value)) {
      snap[key] = snapshot(value, handlePromise);
    } else {
      snap[key] = value;
    }
  });
  return Object.freeze(snap);
}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction2 = (initialObject) => {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propProxyState) => {
    if (isDev && propProxyStates.has(prop)) {
      throw new Error("prop listener already exists");
    }
    if (listeners.size) {
      const remove = propProxyState[3](createPropListener(prop));
      propProxyStates.set(prop, [propProxyState, remove]);
    } else {
      propProxyStates.set(prop, [propProxyState]);
    }
  };
  const removePropListener = (prop) => {
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      entry[1]?.();
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if (isDev && prevRemove) {
          throw new Error("remove already exists");
        }
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const handler = {
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      removePropListener(prop);
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    set(target, prop, value, receiver) {
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
        return true;
      }
      removePropListener(prop);
      if (isObject(value)) {
        value = y(value) || value;
      }
      let nextValue = value;
      if (Object.getOwnPropertyDescriptor(target, prop)?.set) {
      } else if (value instanceof Promise) {
        value.then((v) => {
          value.status = "fulfilled";
          value.value = v;
          notifyUpdate(["resolve", [prop], v]);
        }).catch((e2) => {
          value.status = "rejected";
          value.reason = e2;
          notifyUpdate(["reject", [prop], e2]);
        });
      } else {
        if (!proxyStateMap.has(value) && canProxy(value)) {
          nextValue = proxy(value);
        }
        const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
        if (childProxyState) {
          addPropListener(prop, childProxyState);
        }
      }
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    }
  };
  const proxyObject = newProxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  const proxyState = [baseObject, ensureVersion, createSnapshot, addListener];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key);
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
}) => [
  // public functions
  proxyFunction2,
  // shared state
  proxyStateMap,
  refSet,
  // internal things
  objectIs,
  newProxy,
  canProxy,
  defaultHandlePromise,
  snapCache,
  createSnapshot,
  proxyCache,
  versionHolder
];
var [proxyFunction] = buildProxyFunction();
function proxy(initialObject = {}) {
  return proxyFunction(initialObject);
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  if (isDev && !proxyState) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const addListener = proxyState[3];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject, handlePromise) {
  const proxyState = proxyStateMap.get(proxyObject);
  if (isDev && !proxyState) {
    console.warn("Please use proxy object");
  }
  const [target, ensureVersion, createSnapshot] = proxyState;
  return createSnapshot(target, ensureVersion(), handlePromise);
}
function ref(obj) {
  refSet.add(obj);
  return obj;
}
function proxyWithComputed(initialObject, computedFns) {
  const keys = Object.keys(computedFns);
  keys.forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error("object property already defined");
    }
    const computedFn = computedFns[key];
    const { get, set: set2 } = typeof computedFn === "function" ? { get: computedFn } : computedFn;
    const desc = {};
    desc.get = () => get(snapshot(proxyObject));
    if (set2) {
      desc.set = (newValue) => set2(proxyObject, newValue);
    }
    Object.defineProperty(initialObject, key, desc);
  });
  const proxyObject = proxy(initialObject);
  return proxyObject;
}
var defaultCompareFn = (prev, next) => Object.is(prev, next);
function subscribeKey(obj, key, fn, sync, compareFn) {
  let prev = Reflect.get(snapshot(obj), key);
  const isEqual = compareFn || defaultCompareFn;
  function onSnapshotChange() {
    const snap = snapshot(obj);
    if (isEqual(prev, snap[key]))
      return;
    fn(snap[key]);
    prev = Reflect.get(snap, key);
  }
  return subscribe(obj, onSnapshotChange, sync);
}

// ../../node_modules/.pnpm/klona@2.0.6/node_modules/klona/full/index.mjs
function set(obj, key, val) {
  if (typeof val.value === "object")
    val.value = klona(val.value);
  if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") {
    Object.defineProperty(obj, key, val);
  } else
    obj[key] = val.value;
}
function klona(x) {
  if (typeof x !== "object")
    return x;
  var i2 = 0, k, list, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    tmp = Object.create(x.__proto__ || null);
  } else if (str === "[object Array]") {
    tmp = Array(x.length);
  } else if (str === "[object Set]") {
    tmp = /* @__PURE__ */ new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
  } else if (str === "[object Map]") {
    tmp = /* @__PURE__ */ new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
  } else if (str === "[object Date]") {
    tmp = /* @__PURE__ */ new Date(+x);
  } else if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
  } else if (str === "[object DataView]") {
    tmp = new x.constructor(klona(x.buffer));
  } else if (str === "[object ArrayBuffer]") {
    tmp = x.slice(0);
  } else if (str.slice(-6) === "Array]") {
    tmp = new x.constructor(x);
  }
  if (tmp) {
    for (list = Object.getOwnPropertySymbols(x); i2 < list.length; i2++) {
      set(tmp, list[i2], Object.getOwnPropertyDescriptor(x, list[i2]));
    }
    for (i2 = 0, list = Object.getOwnPropertyNames(x); i2 < list.length; i2++) {
      if (Object.hasOwnProperty.call(tmp, k = list[i2]) && tmp[k] === x[k])
        continue;
      set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
    }
  }
  return tmp || x;
}

// ../../node_modules/.pnpm/@zag-js+core@0.19.1/node_modules/@zag-js/core/dist/index.mjs
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function clear(v) {
  while (v.length > 0)
    v.pop();
  return v;
}
var runIfFn = (v, ...a2) => {
  const res = typeof v === "function" ? v(...a2) : v;
  return res ?? void 0;
};
var cast = (v) => v;
var noop = () => {
};
var uuid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(36);
  };
})();
var isDev2 = () => process.env.NODE_ENV !== "production";
var isArray = (v) => Array.isArray(v);
var isObject2 = (v) => !(v == null || typeof v !== "object" || isArray(v));
var isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
var isString = (v) => typeof v === "string";
var isFunction = (v) => typeof v === "function";
function compact2(obj) {
  if (!isPlainObject2(obj) || obj === void 0) {
    return obj;
  }
  const keys = Reflect.ownKeys(obj).filter((key) => typeof key === "string");
  const filtered = {};
  for (const key of keys) {
    const value = obj[key];
    if (value !== void 0) {
      filtered[key] = compact2(value);
    }
  }
  return filtered;
}
var isPlainObject2 = (value) => {
  return value && typeof value === "object" && value.constructor === Object;
};
function warn(...a2) {
  const m = a2.length === 1 ? a2[0] : a2[1];
  const c2 = a2.length === 2 ? a2[0] : true;
  if (c2 && process.env.NODE_ENV !== "production") {
    console.warn(m);
  }
}
function invariant(...a2) {
  const m = a2.length === 1 ? a2[0] : a2[1];
  const c2 = a2.length === 2 ? a2[0] : true;
  if (c2 && process.env.NODE_ENV !== "production") {
    throw new Error(m);
  }
}
function deepMerge(source, ...objects) {
  for (const obj of objects) {
    const target = compact2(obj);
    for (const key in target) {
      if (isObject2(obj[key])) {
        if (!source[key]) {
          source[key] = {};
        }
        deepMerge(source[key], obj[key]);
      } else {
        source[key] = obj[key];
      }
    }
  }
  return source;
}
function structuredClone(v) {
  return klona(v);
}
function toEvent(event) {
  const obj = isString(event) ? { type: event } : event;
  return obj;
}
function toArray(value) {
  if (!value)
    return [];
  return isArray(value) ? value.slice() : [value];
}
function isGuardHelper(value) {
  return isObject2(value) && value.predicate != null;
}
var Truthy = () => true;
function exec(guardMap, ctx, event, meta) {
  return (guard) => {
    if (isString(guard)) {
      return !!guardMap[guard]?.(ctx, event, meta);
    }
    if (isFunction(guard)) {
      return guard(ctx, event, meta);
    }
    return guard.predicate(guardMap)(ctx, event, meta);
  };
}
function or(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).some(Boolean)
  };
}
function and(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).every(Boolean)
  };
}
function not(condition) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => {
      return !exec(guardMap, ctx, event, meta)(condition);
    }
  };
}
function stateIn(...values) {
  return (_ctx, _evt, meta) => meta.state.matches(...values);
}
var guards = { or, and, not, stateIn };
function determineGuardFn(guard, guardMap) {
  guard = guard ?? Truthy;
  return (context, event, meta) => {
    if (isString(guard)) {
      const value = guardMap[guard];
      return isFunction(value) ? value(context, event, meta) : value;
    }
    if (isGuardHelper(guard)) {
      return guard.predicate(guardMap)(context, event, meta);
    }
    return guard?.(context, event, meta);
  };
}
function determineActionsFn(values, guardMap) {
  return (context, event, meta) => {
    if (isGuardHelper(values)) {
      return values.predicate(guardMap)(context, event, meta);
    }
    return values;
  };
}
function createProxy(config) {
  const computedContext = config.computed ?? cast({});
  const initialContext = config.context ?? cast({});
  const state = proxy({
    value: config.initial ?? "",
    previousValue: "",
    event: cast({}),
    previousEvent: cast({}),
    context: proxyWithComputed(initialContext, computedContext),
    done: false,
    tags: [],
    hasTag(tag) {
      return this.tags.includes(tag);
    },
    matches(...value) {
      return value.includes(this.value);
    },
    can(event) {
      return cast(this).nextEvents.includes(event);
    },
    get nextEvents() {
      const stateEvents = config.states?.[this.value]?.["on"] ?? {};
      const globalEvents = config?.on ?? {};
      return Object.keys({ ...stateEvents, ...globalEvents });
    },
    get changed() {
      if (this.event.value === "machine.init" || !this.previousValue)
        return false;
      return this.value !== this.previousValue;
    }
  });
  return cast(state);
}
function determineDelayFn(delay, delaysMap) {
  return (context, event) => {
    if (isNumber(delay))
      return delay;
    if (isFunction(delay)) {
      return delay(context, event);
    }
    if (isString(delay)) {
      const value = Number.parseFloat(delay);
      if (!Number.isNaN(value)) {
        return value;
      }
      if (delaysMap) {
        const valueOrFn = delaysMap?.[delay];
        invariant(
          valueOrFn == null,
          `[@zag-js/core > determine-delay] Cannot determine delay for \`${delay}\`. It doesn't exist in \`options.delays\``
        );
        return isFunction(valueOrFn) ? valueOrFn(context, event) : valueOrFn;
      }
    }
  };
}
function toTarget(target) {
  return isString(target) ? { target } : target;
}
function determineTransitionFn(transitions, guardMap) {
  return (context, event, meta) => {
    return toArray(transitions).map(toTarget).find((transition) => {
      const determineGuard = determineGuardFn(transition.guard, guardMap);
      const guard = determineGuard(context, event, meta);
      return guard ?? transition.target ?? transition.actions;
    });
  };
}
var Machine = class _Machine {
  // Let's get started!
  constructor(config, options) {
    __publicField(
      this,
      "status",
      "Not Started"
      /* NotStarted */
    );
    __publicField(this, "state");
    __publicField(this, "initialState");
    __publicField(this, "initialContext");
    __publicField(this, "id");
    __publicField(
      this,
      "type",
      "machine"
      /* Machine */
    );
    __publicField(this, "activityEvents", /* @__PURE__ */ new Map());
    __publicField(this, "delayedEvents", /* @__PURE__ */ new Map());
    __publicField(this, "stateListeners", /* @__PURE__ */ new Set());
    __publicField(this, "contextListeners", /* @__PURE__ */ new Set());
    __publicField(this, "eventListeners", /* @__PURE__ */ new Set());
    __publicField(this, "doneListeners", /* @__PURE__ */ new Set());
    __publicField(this, "contextWatchers", /* @__PURE__ */ new Set());
    __publicField(this, "removeStateListener", noop);
    __publicField(this, "removeEventListener", noop);
    __publicField(this, "removeContextListener", noop);
    __publicField(this, "parent");
    __publicField(this, "children", /* @__PURE__ */ new Map());
    __publicField(this, "guardMap");
    __publicField(this, "actionMap");
    __publicField(this, "delayMap");
    __publicField(this, "activityMap");
    __publicField(this, "sync");
    __publicField(this, "options");
    __publicField(this, "config");
    __publicField(this, "start", (init) => {
      this.state.value = "";
      if (this.status === "Running") {
        return this;
      }
      this.status = "Running";
      this.removeStateListener = subscribe(
        this.state,
        () => {
          this.stateListeners.forEach((listener) => {
            listener(this.stateSnapshot);
          });
        },
        this.sync
      );
      this.removeEventListener = subscribeKey(
        this.state,
        "event",
        (event22) => {
          this.executeActions(this.config.onEvent, event22);
          this.eventListeners.forEach((listener) => {
            listener(event22);
          });
        },
        this.sync
      );
      this.removeContextListener = subscribe(
        this.state.context,
        () => {
          this.log("Context:", this.contextSnapshot);
          this.contextListeners.forEach((listener) => {
            listener(this.contextSnapshot);
          });
        },
        this.sync || this.options.debug
      );
      this.setupContextWatchers();
      this.executeActivities(
        toEvent(
          "machine.start"
          /* Start */
        ),
        toArray(this.config.activities),
        "machine.start"
        /* Start */
      );
      this.executeActions(this.config.entry, toEvent(
        "machine.start"
        /* Start */
      ));
      const event2 = toEvent(
        "machine.init"
        /* Init */
      );
      const target = isObject2(init) ? init.value : init;
      const context = isObject2(init) ? init.context : void 0;
      if (context) {
        this.setContext(context);
      }
      const transition = {
        target: target ?? this.config.initial
      };
      const next = this.getNextStateInfo(transition, event2);
      this.initialState = next;
      this.performStateChangeEffects(this.state.value, next, event2);
      return this;
    });
    __publicField(this, "setupContextWatchers", () => {
      for (const [key, fn] of Object.entries(this.config.watch ?? {})) {
        const compareFn = this.options.compareFns?.[key];
        const cleanup = subscribeKey(
          this.state.context,
          key,
          () => {
            this.executeActions(fn, this.state.event);
          },
          this.sync,
          compareFn
        );
        this.contextWatchers.add(cleanup);
      }
    });
    __publicField(this, "stop", () => {
      if (this.status === "Stopped")
        return;
      this.performExitEffects(this.state.value, toEvent(
        "machine.stop"
        /* Stop */
      ));
      this.executeActions(this.config.exit, toEvent(
        "machine.stop"
        /* Stop */
      ));
      this.setState("");
      this.setEvent(
        "machine.stop"
        /* Stop */
      );
      this.stopStateListeners();
      this.stopChildren();
      this.stopActivities();
      this.stopDelayedEvents();
      this.stopContextWatchers();
      this.stopEventListeners();
      this.stopContextListeners();
      this.status = "Stopped";
      return this;
    });
    __publicField(this, "stopEventListeners", () => {
      this.eventListeners.clear();
      this.removeEventListener();
    });
    __publicField(this, "stopContextListeners", () => {
      this.contextListeners.clear();
      this.removeContextListener();
    });
    __publicField(this, "stopStateListeners", () => {
      this.removeStateListener();
      this.stateListeners.clear();
    });
    __publicField(this, "stopContextWatchers", () => {
      this.contextWatchers.forEach((fn) => fn());
      this.contextWatchers.clear();
    });
    __publicField(this, "stopDelayedEvents", () => {
      this.delayedEvents.forEach((state) => {
        state.forEach((stop) => stop());
      });
      this.delayedEvents.clear();
    });
    __publicField(this, "stopActivities", (state) => {
      if (state) {
        this.activityEvents.get(state)?.forEach((stop) => stop());
        this.activityEvents.get(state)?.clear();
        this.activityEvents.delete(state);
      } else {
        this.activityEvents.forEach((state2) => {
          state2.forEach((stop) => stop());
          state2.clear();
        });
        this.activityEvents.clear();
      }
    });
    __publicField(this, "sendChild", (evt, to) => {
      const event2 = toEvent(evt);
      const id = runIfFn(to, this.contextSnapshot);
      const child = this.children.get(id);
      if (!child) {
        invariant(`[@zag-js/core] Cannot send '${event2.type}' event to unknown child`);
      }
      child.send(event2);
    });
    __publicField(this, "stopChild", (id) => {
      if (!this.children.has(id)) {
        invariant(`[@zag-js/core > stop-child] Cannot stop unknown child ${id}`);
      }
      this.children.get(id).stop();
      this.children.delete(id);
    });
    __publicField(this, "removeChild", (id) => {
      this.children.delete(id);
    });
    __publicField(this, "stopChildren", () => {
      this.children.forEach((child) => child.stop());
      this.children.clear();
    });
    __publicField(this, "setParent", (parent) => {
      this.parent = parent;
    });
    __publicField(this, "spawn", (src, id) => {
      const actor = runIfFn(src);
      if (id)
        actor.id = id;
      actor.type = "machine.actor";
      actor.setParent(this);
      this.children.set(actor.id, cast(actor));
      actor.onDone(() => {
        this.removeChild(actor.id);
      }).start();
      return cast(ref(actor));
    });
    __publicField(this, "stopActivity", (key) => {
      if (!this.state.value)
        return;
      const cleanups = this.activityEvents.get(this.state.value);
      cleanups?.get(key)?.();
      cleanups?.delete(key);
    });
    __publicField(this, "addActivityCleanup", (state, key, cleanup) => {
      if (!state)
        return;
      if (!this.activityEvents.has(state)) {
        this.activityEvents.set(state, /* @__PURE__ */ new Map([[key, cleanup]]));
      } else {
        this.activityEvents.get(state)?.set(key, cleanup);
      }
    });
    __publicField(this, "setState", (target) => {
      this.state.previousValue = this.state.value;
      this.state.value = target;
      const stateNode = this.getStateNode(target);
      if (target == null) {
        clear(this.state.tags);
      } else {
        this.state.tags = toArray(stateNode?.tags);
      }
    });
    __publicField(this, "transformContext", (context) => {
      this.options?.transformContext?.(context);
      return context;
    });
    __publicField(this, "setContext", (context) => {
      if (!context)
        return;
      deepMerge(this.state.context, this.transformContext(context));
    });
    __publicField(this, "withContext", (context) => {
      const transformed = this.transformContext(context);
      const newContext = { ...this.config.context, ...compact2(transformed) };
      return new _Machine({ ...this.config, context: newContext }, this.options);
    });
    __publicField(this, "setOptions", (options2) => {
      const opts = compact2(options2);
      this.actionMap = { ...this.actionMap, ...opts.actions };
      this.delayMap = { ...this.delayMap, ...opts.delays };
      this.activityMap = { ...this.activityMap, ...opts.activities };
      this.guardMap = { ...this.guardMap, ...opts.guards };
    });
    __publicField(this, "getStateNode", (state) => {
      if (!state)
        return;
      return this.config.states?.[state];
    });
    __publicField(this, "getNextStateInfo", (transitions, event2) => {
      const transition = this.determineTransition(transitions, event2);
      const isTargetless = !transition?.target;
      const target = transition?.target ?? this.state.value;
      const changed = this.state.value !== target;
      const stateNode = this.getStateNode(target);
      const reenter = !isTargetless && !changed && !transition?.internal;
      const info = {
        reenter,
        transition,
        stateNode,
        target,
        changed
      };
      this.log("NextState:", `[${event2.type}]`, this.state.value, "---->", info.target);
      return info;
    });
    __publicField(this, "getActionFromDelayedTransition", (transition) => {
      const event2 = toEvent(
        "machine.after"
        /* After */
      );
      const determineDelay = determineDelayFn(transition.delay, this.delayMap);
      const delay = determineDelay(this.contextSnapshot, event2);
      let id;
      return {
        entry: () => {
          id = globalThis.setTimeout(() => {
            const next = this.getNextStateInfo(transition, event2);
            this.performStateChangeEffects(this.state.value, next, event2);
          }, delay);
        },
        exit: () => {
          globalThis.clearTimeout(id);
        }
      };
    });
    __publicField(this, "getDelayedEventActions", (state) => {
      const stateNode = this.getStateNode(state);
      const event2 = toEvent(
        "machine.after"
        /* After */
      );
      if (!stateNode || !stateNode.after)
        return;
      const entries = [];
      const exits = [];
      if (isArray(stateNode.after)) {
        const transition = this.determineTransition(stateNode.after, event2);
        if (!transition)
          return;
        const actions = this.getActionFromDelayedTransition(transition);
        entries.push(actions.entry);
        exits.push(actions.exit);
      } else if (isObject2(stateNode.after)) {
        for (const delay in stateNode.after) {
          const transition = stateNode.after[delay];
          let resolvedTransition = {};
          if (isArray(transition)) {
            const picked = this.determineTransition(transition, event2);
            if (picked)
              resolvedTransition = picked;
          } else if (isString(transition)) {
            resolvedTransition = { target: transition, delay };
          } else {
            resolvedTransition = { ...transition, delay };
          }
          const actions = this.getActionFromDelayedTransition(resolvedTransition);
          entries.push(actions.entry);
          exits.push(actions.exit);
        }
      }
      return { entries, exits };
    });
    __publicField(this, "executeActions", (actions, event2) => {
      const pickedActions = determineActionsFn(actions, this.guardMap)(this.contextSnapshot, event2, this.guardMeta);
      for (const action of toArray(pickedActions)) {
        const fn = isString(action) ? this.actionMap?.[action] : action;
        warn(
          isString(action) && !fn,
          `[@zag-js/core > execute-actions] No implementation found for action: \`${action}\``
        );
        fn?.(this.state.context, event2, this.meta);
      }
    });
    __publicField(this, "executeActivities", (event2, activities, state) => {
      for (const activity of activities) {
        const fn = isString(activity) ? this.activityMap?.[activity] : activity;
        if (!fn) {
          warn(`[@zag-js/core > execute-activity] No implementation found for activity: \`${activity}\``);
          continue;
        }
        const cleanup = fn(this.state.context, event2, this.meta);
        if (cleanup) {
          const key = isString(activity) ? activity : activity.name || uuid();
          this.addActivityCleanup(state ?? this.state.value, key, cleanup);
        }
      }
    });
    __publicField(this, "createEveryActivities", (every, callbackfn) => {
      if (!every)
        return;
      const event2 = toEvent(
        "machine.every"
        /* Every */
      );
      if (isArray(every)) {
        const picked = toArray(every).find((transition) => {
          const delayOrFn = transition.delay;
          const determineDelay2 = determineDelayFn(delayOrFn, this.delayMap);
          const delay2 = determineDelay2(this.contextSnapshot, event2);
          const determineGuard = determineGuardFn(transition.guard, this.guardMap);
          const guard = determineGuard(this.contextSnapshot, event2, this.guardMeta);
          return guard ?? delay2 != null;
        });
        if (!picked)
          return;
        const determineDelay = determineDelayFn(picked.delay, this.delayMap);
        const delay = determineDelay(this.contextSnapshot, event2);
        const activity = () => {
          const id = globalThis.setInterval(() => {
            this.executeActions(picked.actions, event2);
          }, delay);
          return () => {
            globalThis.clearInterval(id);
          };
        };
        callbackfn(activity);
      } else {
        for (const interval in every) {
          const actions = every?.[interval];
          const determineDelay = determineDelayFn(interval, this.delayMap);
          const delay = determineDelay(this.contextSnapshot, event2);
          const activity = () => {
            const id = globalThis.setInterval(() => {
              this.executeActions(actions, event2);
            }, delay);
            return () => {
              globalThis.clearInterval(id);
            };
          };
          callbackfn(activity);
        }
      }
    });
    __publicField(this, "setEvent", (event2) => {
      this.state.previousEvent = this.state.event;
      this.state.event = ref(toEvent(event2));
    });
    __publicField(this, "performExitEffects", (current, event2) => {
      const currentState = this.state.value;
      if (currentState === "")
        return;
      const stateNode = current ? this.getStateNode(current) : void 0;
      this.stopActivities(currentState);
      const _exit = determineActionsFn(stateNode?.exit, this.guardMap)(this.contextSnapshot, event2, this.guardMeta);
      const exitActions = toArray(_exit);
      const afterExitActions = this.delayedEvents.get(currentState);
      if (afterExitActions) {
        exitActions.push(...afterExitActions);
      }
      this.executeActions(exitActions, event2);
      this.eventListeners.clear();
    });
    __publicField(this, "performEntryEffects", (next, event2) => {
      const stateNode = this.getStateNode(next);
      const activities = toArray(stateNode?.activities);
      this.createEveryActivities(stateNode?.every, (activity) => {
        activities.unshift(activity);
      });
      if (activities.length > 0) {
        this.executeActivities(event2, activities);
      }
      const pickedActions = determineActionsFn(stateNode?.entry, this.guardMap)(
        this.contextSnapshot,
        event2,
        this.guardMeta
      );
      const entryActions = toArray(pickedActions);
      const afterActions = this.getDelayedEventActions(next);
      if (stateNode?.after && afterActions) {
        this.delayedEvents.set(next, afterActions?.exits);
        entryActions.push(...afterActions.entries);
      }
      this.executeActions(entryActions, event2);
      if (stateNode?.type === "final") {
        this.state.done = true;
        this.doneListeners.forEach((listener) => {
          listener(this.stateSnapshot);
        });
        this.stop();
      }
    });
    __publicField(this, "performTransitionEffects", (transitions, event2) => {
      const transition = this.determineTransition(transitions, event2);
      this.executeActions(transition?.actions, event2);
    });
    __publicField(this, "performStateChangeEffects", (current, next, event2) => {
      this.setEvent(event2);
      const changed = next.changed || next.reenter;
      if (changed) {
        this.performExitEffects(current, event2);
      }
      this.performTransitionEffects(next.transition, event2);
      this.setState(next.target);
      if (changed) {
        this.performEntryEffects(next.target, event2);
      }
    });
    __publicField(this, "determineTransition", (transition, event2) => {
      const fn = determineTransitionFn(transition, this.guardMap);
      return fn?.(this.contextSnapshot, event2, this.guardMeta);
    });
    __publicField(this, "sendParent", (evt) => {
      if (!this.parent) {
        invariant("[@zag-js/core > send-parent] Cannot send event to an unknown parent");
      }
      const event2 = toEvent(evt);
      this.parent?.send(event2);
    });
    __publicField(this, "log", (...args) => {
      if (isDev2() && this.options.debug) {
        console.log(...args);
      }
    });
    __publicField(this, "send", (evt) => {
      const event2 = toEvent(evt);
      this.transition(this.state.value, event2);
    });
    __publicField(this, "transition", (state, evt) => {
      const stateNode = isString(state) ? this.getStateNode(state) : state?.stateNode;
      const event2 = toEvent(evt);
      if (!stateNode && !this.config.on) {
        const msg = this.status === "Stopped" ? "[@zag-js/core > transition] Cannot transition a stopped machine" : `[@zag-js/core > transition] State does not have a definition for \`state\`: ${state}, \`event\`: ${event2.type}`;
        warn(msg);
        return;
      }
      const transitions = stateNode?.on?.[event2.type] ?? this.config.on?.[event2.type];
      const next = this.getNextStateInfo(transitions, event2);
      this.performStateChangeEffects(this.state.value, next, event2);
      return next.stateNode;
    });
    __publicField(this, "subscribe", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running") {
        listener(this.stateSnapshot);
      }
      return () => {
        this.stateListeners.delete(listener);
      };
    });
    __publicField(this, "onDone", (listener) => {
      this.doneListeners.add(listener);
      return this;
    });
    __publicField(this, "onTransition", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running") {
        listener(this.stateSnapshot);
      }
      return this;
    });
    __publicField(this, "onChange", (listener) => {
      this.contextListeners.add(listener);
      return this;
    });
    __publicField(this, "onEvent", (listener) => {
      this.eventListeners.add(listener);
      return this;
    });
    this.config = structuredClone(config);
    this.options = structuredClone(options ?? {});
    this.id = this.config.id ?? `machine-${uuid()}`;
    this.guardMap = this.options?.guards ?? {};
    this.actionMap = this.options?.actions ?? {};
    this.delayMap = this.options?.delays ?? {};
    this.activityMap = this.options?.activities ?? {};
    this.sync = this.options?.sync ?? false;
    this.state = createProxy(this.config);
    this.initialContext = snapshot(this.state.context);
    this.transformContext(this.state.context);
    const event = toEvent(
      "machine.created"
      /* Created */
    );
    this.executeActions(this.config?.created, event);
  }
  // immutable state value
  get stateSnapshot() {
    return cast(snapshot(this.state));
  }
  getState() {
    return this.stateSnapshot;
  }
  // immutable context value
  get contextSnapshot() {
    return this.stateSnapshot.context;
  }
  /**
   * A reference to the instance methods of the machine.
   * Useful when spawning child machines and managing the communication between them.
   */
  get self() {
    const self = this;
    return {
      id: this.id,
      send: this.send.bind(this),
      sendParent: this.sendParent.bind(this),
      sendChild: this.sendChild.bind(this),
      stop: this.stop.bind(this),
      stopChild: this.stopChild.bind(this),
      spawn: this.spawn.bind(this),
      stopActivity: this.stopActivity.bind(this),
      get state() {
        return self.stateSnapshot;
      },
      get initialContext() {
        return self.initialContext;
      },
      get initialState() {
        return self.initialState?.target ?? "";
      }
    };
  }
  get meta() {
    return {
      state: this.stateSnapshot,
      guards: this.guardMap,
      send: this.send.bind(this),
      self: this.self,
      initialContext: this.initialContext,
      initialState: this.initialState?.target ?? "",
      getState: () => this.stateSnapshot,
      getAction: (key) => this.actionMap[key],
      getGuard: (key) => this.guardMap[key]
    };
  }
  get guardMeta() {
    return {
      state: this.stateSnapshot
    };
  }
  get [Symbol.toStringTag]() {
    return "Machine";
  }
};
var createMachine = (config, options) => new Machine(config, options);

// ../../node_modules/.pnpm/@zag-js+dom-event@0.19.1/node_modules/@zag-js/dom-event/dist/index.mjs
var addDomEvent2 = (target, eventName, handler, options) => {
  const node = typeof target === "function" ? target() : target;
  node?.addEventListener(eventName, handler, options);
  return () => {
    node?.removeEventListener(eventName, handler, options);
  };
};

// ../../node_modules/.pnpm/@zag-js+tooltip@0.19.1/node_modules/@zag-js/tooltip/dist/index.mjs
var anatomy = createAnatomy("tooltip").parts("trigger", "arrow", "arrowTip", "positioner", "content");
var parts = anatomy.build();
var dom = createScope({
  getTriggerId: (ctx) => ctx.ids?.trigger ?? `tooltip:${ctx.id}:trigger`,
  getContentId: (ctx) => ctx.ids?.content ?? `tooltip:${ctx.id}:content`,
  getArrowId: (ctx) => ctx.ids?.arrow ?? `tooltip:${ctx.id}:arrow`,
  getPositionerId: (ctx) => ctx.ids?.positioner ?? `tooltip:${ctx.id}:popper`,
  getTriggerEl: (ctx) => dom.getById(ctx, dom.getTriggerId(ctx)),
  getContentEl: (ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getPositionerEl: (ctx) => dom.getById(ctx, dom.getPositionerId(ctx)),
  getArrowEl: (ctx) => dom.getById(ctx, dom.getArrowId(ctx)),
  getScrollParent: (ctx) => getScrollParent(dom.getTriggerEl(ctx))
});
var store = proxy({
  id: null,
  prevId: null,
  setId(val) {
    this.prevId = this.id;
    this.id = val;
  }
});
function connect(state, send, normalize) {
  const id = state.context.id;
  const hasAriaLabel = state.context.hasAriaLabel;
  const isOpen = state.hasTag("open");
  const triggerId = dom.getTriggerId(state.context);
  const contentId = dom.getContentId(state.context);
  const isDisabled = state.context.disabled;
  const popperStyles = getPlacementStyles({
    ...state.context.positioning,
    placement: state.context.currentPlacement
  });
  return {
    isOpen,
    open() {
      send("OPEN");
    },
    close() {
      send("CLOSE");
    },
    setPositioning(options = {}) {
      send({ type: "SET_POSITIONING", options });
    },
    triggerProps: normalize.button({
      ...parts.trigger.attrs,
      id: triggerId,
      "data-expanded": dataAttr(isOpen),
      "data-state": isOpen ? "open" : "closed",
      "aria-describedby": isOpen ? contentId : void 0,
      onClick() {
        send("CLICK");
      },
      onFocus() {
        if (state.event.type === "POINTER_DOWN")
          return;
        send("FOCUS");
      },
      onBlur() {
        if (id === store.id) {
          send("BLUR");
        }
      },
      onPointerDown() {
        if (isDisabled)
          return;
        if (id === store.id) {
          send("POINTER_DOWN");
        }
      },
      onPointerMove(event) {
        if (isDisabled || event.pointerType === "touch")
          return;
        send("POINTER_MOVE");
      },
      onPointerLeave() {
        if (isDisabled)
          return;
        send("POINTER_LEAVE");
      },
      onPointerCancel() {
        if (isDisabled)
          return;
        send("POINTER_LEAVE");
      }
    }),
    arrowProps: normalize.element({
      id: dom.getArrowId(state.context),
      ...parts.arrow.attrs,
      style: popperStyles.arrow
    }),
    arrowTipProps: normalize.element({
      ...parts.arrowTip.attrs,
      style: popperStyles.arrowTip
    }),
    positionerProps: normalize.element({
      id: dom.getPositionerId(state.context),
      ...parts.positioner.attrs,
      style: popperStyles.floating
    }),
    contentProps: normalize.element({
      ...parts.content.attrs,
      hidden: !isOpen,
      "data-state": isOpen ? "open" : "closed",
      role: hasAriaLabel ? void 0 : "tooltip",
      id: hasAriaLabel ? void 0 : contentId,
      "data-placement": state.context.currentPlacement,
      onPointerEnter() {
        send("CONTENT.POINTER_MOVE");
      },
      onPointerLeave() {
        send("CONTENT.POINTER_LEAVE");
      },
      style: {
        pointerEvents: state.context.interactive ? "auto" : "none"
      }
    })
  };
}
var { and: and2, not: not2 } = guards;
function machine(userContext) {
  const ctx = compact(userContext);
  return createMachine(
    {
      id: "tooltip",
      initial: "closed",
      context: {
        openDelay: 1e3,
        closeDelay: 500,
        closeOnPointerDown: true,
        closeOnEsc: true,
        interactive: true,
        currentPlacement: void 0,
        ...ctx,
        hasPointerMoveOpened: false,
        positioning: {
          placement: "bottom",
          ...ctx.positioning
        }
      },
      computed: {
        hasAriaLabel: (ctx2) => !!ctx2["aria-label"]
      },
      watch: {
        disabled: ["closeIfDisabled"],
        open: ["toggleVisibility"]
      },
      on: {
        OPEN: "open",
        CLOSE: "closed"
      },
      states: {
        closed: {
          tags: ["closed"],
          entry: ["clearGlobalId", "invokeOnClose"],
          on: {
            FOCUS: "open",
            POINTER_LEAVE: {
              actions: ["clearPointerMoveOpened"]
            },
            POINTER_MOVE: [
              {
                guard: and2("noVisibleTooltip", not2("hasPointerMoveOpened")),
                target: "opening"
              },
              {
                guard: not2("hasPointerMoveOpened"),
                target: "open",
                actions: ["setPointerMoveOpened"]
              }
            ]
          }
        },
        opening: {
          tags: ["closed"],
          activities: ["trackScroll", "trackPointerlockChange"],
          after: {
            OPEN_DELAY: {
              target: "open",
              actions: ["setPointerMoveOpened"]
            }
          },
          on: {
            POINTER_LEAVE: {
              target: "closed",
              actions: ["clearPointerMoveOpened"]
            },
            BLUR: "closed",
            SCROLL: "closed",
            POINTER_LOCK_CHANGE: "closed",
            POINTER_DOWN: {
              guard: "closeOnPointerDown",
              target: "closed"
            }
          }
        },
        open: {
          tags: ["open"],
          activities: [
            "trackEscapeKey",
            "trackDisabledTriggerOnSafari",
            "trackScroll",
            "trackPointerlockChange",
            "trackPositioning"
          ],
          entry: ["setGlobalId", "invokeOnOpen"],
          on: {
            POINTER_LEAVE: [
              {
                guard: "isVisible",
                target: "closing",
                actions: ["clearPointerMoveOpened"]
              },
              {
                target: "closed",
                actions: ["clearPointerMoveOpened"]
              }
            ],
            BLUR: "closed",
            ESCAPE: "closed",
            SCROLL: "closed",
            POINTER_LOCK_CHANGE: "closed",
            "CONTENT.POINTER_LEAVE": {
              guard: "isInteractive",
              target: "closing"
            },
            POINTER_DOWN: {
              guard: "closeOnPointerDown",
              target: "closed"
            },
            CLICK: "closed",
            SET_POSITIONING: {
              actions: "setPositioning"
            }
          }
        },
        closing: {
          tags: ["open"],
          activities: ["trackStore", "trackPositioning"],
          after: {
            CLOSE_DELAY: "closed"
          },
          on: {
            FORCE_CLOSE: "closed",
            POINTER_MOVE: {
              target: "open",
              actions: ["setPointerMoveOpened"]
            },
            "CONTENT.POINTER_MOVE": {
              guard: "isInteractive",
              target: "open"
            }
          }
        }
      }
    },
    {
      activities: {
        trackPositioning(ctx2) {
          ctx2.currentPlacement = ctx2.positioning.placement;
          const getPositionerEl = () => dom.getPositionerEl(ctx2);
          return getPlacement(dom.getTriggerEl(ctx2), getPositionerEl, {
            ...ctx2.positioning,
            defer: true,
            onComplete(data) {
              ctx2.currentPlacement = data.placement;
            },
            onCleanup() {
              ctx2.currentPlacement = void 0;
            }
          });
        },
        trackPointerlockChange(ctx2, _evt, { send }) {
          const onChange = () => send("POINTER_LOCK_CHANGE");
          return addDomEvent2(dom.getDoc(ctx2), "pointerlockchange", onChange, false);
        },
        trackScroll(ctx2, _evt, { send }) {
          const trigger = dom.getTriggerEl(ctx2);
          if (!trigger)
            return;
          const cleanups = getScrollParents(trigger).map((el) => {
            const opts = { passive: true, capture: true };
            return addDomEvent2(el, "scroll", () => send("SCROLL"), opts);
          });
          return () => {
            cleanups.forEach((fn) => fn?.());
          };
        },
        trackStore(ctx2, _evt, { send }) {
          return subscribe(store, () => {
            if (store.id !== ctx2.id) {
              send("FORCE_CLOSE");
            }
          });
        },
        trackDisabledTriggerOnSafari(ctx2, _evt, { send }) {
          if (!isSafari())
            return;
          const doc = dom.getDoc(ctx2);
          return addDomEvent2(doc, "pointermove", (event) => {
            const selector = "[data-part=trigger][data-expanded]";
            if (isHTMLElement(event.target) && event.target.closest(selector))
              return;
            send("POINTER_LEAVE");
          });
        },
        trackEscapeKey(ctx2, _evt, { send }) {
          if (!ctx2.closeOnEsc)
            return;
          const doc = dom.getDoc(ctx2);
          return addDomEvent2(doc, "keydown", (event) => {
            if (event.key === "Escape") {
              send("ESCAPE");
            }
          });
        }
      },
      actions: {
        setGlobalId(ctx2) {
          store.setId(ctx2.id);
        },
        clearGlobalId(ctx2) {
          if (ctx2.id === store.id) {
            store.setId(null);
          }
        },
        invokeOnOpen(ctx2, evt) {
          const omit = ["CONTENT.POINTER_MOVE", "POINTER_MOVE"];
          if (!omit.includes(evt.type)) {
            ctx2.onOpen?.();
          }
        },
        invokeOnClose(ctx2) {
          ctx2.onClose?.();
        },
        closeIfDisabled(ctx2, _evt, { send }) {
          if (!ctx2.disabled)
            return;
          send("CLOSE");
        },
        setPositioning(ctx2, evt) {
          const getPositionerEl = () => dom.getPositionerEl(ctx2);
          getPlacement(dom.getTriggerEl(ctx2), getPositionerEl, {
            ...ctx2.positioning,
            ...evt.options,
            defer: true,
            listeners: false
          });
        },
        toggleVisibility(ctx2, _evt, { send }) {
          send({ type: ctx2.open ? "OPEN" : "CLOSE", src: "controlled" });
        },
        setPointerMoveOpened(ctx2) {
          ctx2.hasPointerMoveOpened = true;
        },
        clearPointerMoveOpened(ctx2) {
          ctx2.hasPointerMoveOpened = false;
        }
      },
      guards: {
        closeOnPointerDown: (ctx2) => ctx2.closeOnPointerDown,
        noVisibleTooltip: () => store.id === null,
        isVisible: (ctx2) => ctx2.id === store.id,
        isInteractive: (ctx2) => ctx2.interactive,
        hasPointerMoveOpened: (ctx2) => !!ctx2.hasPointerMoveOpened
      },
      delays: {
        OPEN_DELAY: (ctx2) => ctx2.openDelay,
        CLOSE_DELAY: (ctx2) => ctx2.closeDelay
      }
    }
  );
}

// ../../node_modules/.pnpm/@zag-js+types@0.19.1/node_modules/@zag-js/types/dist/index.mjs
function createNormalizer(fn) {
  return new Proxy({}, {
    get() {
      return fn;
    }
  });
}

// ../../node_modules/.pnpm/@zag-js+react@0.19.1_react-dom@18.2.0_react@18.2.0/node_modules/@zag-js/react/dist/index.mjs
import { createElement, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect } from "react";
import ReactExports, { useCallback, useEffect as useEffect2, useMemo, useRef as useRef2, useSyncExternalStore } from "react";
import { useRef as useRef3 } from "react";
var normalizeProps = createNormalizer((v) => v);
var useSafeLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;
var { use } = ReactExports;
var targetCache = /* @__PURE__ */ new WeakMap();
function useSnapshot(proxyObject, options) {
  const notifyInSync = options?.sync;
  const lastSnapshot = useRef2();
  const lastAffected = useRef2();
  const currSnapshot = useSyncExternalStore(
    useCallback(
      (callback) => {
        const unsub = subscribe(proxyObject, callback, notifyInSync);
        callback();
        return unsub;
      },
      [proxyObject, notifyInSync]
    ),
    () => {
      const nextSnapshot = snapshot(proxyObject, use);
      try {
        if (lastSnapshot.current && lastAffected.current && !p(lastSnapshot.current, nextSnapshot, lastAffected.current, /* @__PURE__ */ new WeakMap())) {
          return lastSnapshot.current;
        }
      } catch (e2) {
      }
      return nextSnapshot;
    },
    () => snapshot(proxyObject, use)
  );
  const currAffected = /* @__PURE__ */ new WeakMap();
  useEffect2(() => {
    lastSnapshot.current = currSnapshot;
    lastAffected.current = currAffected;
  });
  const proxyCache = useMemo(() => /* @__PURE__ */ new WeakMap(), []);
  return a(currSnapshot, currAffected, proxyCache, targetCache);
}
function useConstant(fn) {
  const ref2 = useRef3();
  if (!ref2.current)
    ref2.current = { v: fn() };
  return ref2.current.v;
}
function useService(machine2, options) {
  const { actions, state: hydratedState, context } = options ?? {};
  const service = useConstant(() => {
    const instance = typeof machine2 === "function" ? machine2() : machine2;
    return context ? instance.withContext(context) : instance;
  });
  useSafeLayoutEffect(() => {
    service.start(hydratedState);
    if (service.state.can("SETUP")) {
      service.send("SETUP");
    }
    return () => {
      service.stop();
    };
  }, []);
  service.setOptions({ actions });
  service.setContext(context);
  return service;
}
function useMachine(machine2, options) {
  const service = useService(machine2, options);
  const state = useSnapshot(service.state);
  const typedState = state;
  return [typedState, service.send, service];
}

// ../../node_modules/.pnpm/@cfx-kit+ui-components@0.0.17_@zag-js+accordion@0.19.1_@zag-js+checkbox@0.19.1_@zag-js+dialog_fmko2yy6bkfybbxu2fwkms7fpm/node_modules/@cfx-kit/ui-components/dist/Tooltip.js
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Tooltip = (_a) => {
  var _b = _a, {
    id,
    open = false,
    openDelay = 200,
    closeDelay = 200,
    arrow: arrow2 = true,
    positioning,
    children,
    containerClassName,
    trigger
  } = _b, props = __objRest(_b, [
    "id",
    "open",
    "openDelay",
    "closeDelay",
    "arrow",
    "positioning",
    "children",
    "containerClassName",
    "trigger"
  ]);
  const uniqueId = useId();
  const [state, send] = useMachine(machine(__spreadValues({ id: id != null ? id : uniqueId, openDelay, closeDelay, positioning }, props)));
  const api = connect(state, send, normalizeProps);
  useEffect3(() => {
    if (open === true) {
      api.open();
    } else {
      api.close();
    }
  }, [open]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    typeof trigger === "function" ? trigger({ triggerProps: api.triggerProps }) : null,
    api.isOpen && /* @__PURE__ */ jsxs("div", __spreadProps(__spreadValues({ className: `ui-tooltip${containerClassName ? ` ${containerClassName}` : ""}` }, api.positionerProps), { children: [
      arrow2 && /* @__PURE__ */ jsx("div", __spreadProps(__spreadValues({}, api.arrowProps), { children: /* @__PURE__ */ jsx("div", __spreadValues({}, api.arrowTipProps)) })),
      typeof children === "function" && children({ contentProps: api.contentProps }),
      typeof children !== "function" ? Children.count(children) === 1 && isValidElement(children) ? cloneElement(children, __spreadValues({}, api.contentProps)) : /* @__PURE__ */ jsx("div", __spreadProps(__spreadValues({}, api.contentProps), { children })) : null
    ] }))
  ] });
};
var Tooltip_default = Tooltip;

// src/components/Tooltip/index.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var InfoIconWithTooltip = ({
  info,
  size: size2 = 14,
  children = null
}) => {
  const title = typeof info === "string" ? info.split("\n").map((i2) => /* @__PURE__ */ jsx2("div", { children: i2 })) : info;
  return /* @__PURE__ */ jsxs2("div", { children: [
    children ? /* @__PURE__ */ jsx2("span", { className: "infoIcon-text", children }) : null,
    /* @__PURE__ */ jsx2(
      Tooltip_default,
      {
        trigger: ({ triggerProps }) => /* @__PURE__ */ jsx2("div", { ...triggerProps, children: "1111" }),
        children: title
      }
    )
  ] });
};
export {
  InfoIconWithTooltip
};
//# sourceMappingURL=index.js.map