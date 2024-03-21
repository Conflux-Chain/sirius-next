"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTableDataByHttp = void 0;
const react_router_dom_1 = require("react-router-dom");
const index_1 = require("../index");
const qs_1 = __importDefault(require("qs"));
const useTableDataByHttp = (url, inactive = false, shouldFetch = true) => {
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    let { page: searchPageNumber, pageSize: searchPageSize, tab, ...others } = qs_1.default.parse(inactive ? '' : location.search);
    let parsedPageNumber = '1';
    let parsedPageSize = '10';
    let skip = '0';
    try {
        const page = (Number(searchPageNumber) - 1) * Number(searchPageSize);
        if (window.isNaN(page) || page < 0) {
            throw new Error('invalid page');
        }
        parsedPageNumber = String(searchPageNumber);
        skip = String(page);
    }
    catch (e) { }
    try {
        const pageSize = Number(searchPageSize);
        if (window.isNaN(pageSize) || pageSize < 0) {
            throw new Error('invalid pageSize');
        }
        parsedPageSize = String(pageSize);
    }
    catch (e) { }
    const urlQuery = qs_1.default.parse(url).query;
    const urlWithQuery = qs_1.default.stringify({
        url,
        query: {
            ...others,
            // inactive is used in useTabTableData indicating the tab displaying this
            // table is not the current tab, so there's no need to sync page info, but
            // we still need to sync filter info cause the filters are applied to all
            // tables
            limit: inactive ? undefined : parsedPageSize,
            skip: inactive ? undefined : skip,
            ...urlQuery,
        },
    });
    const { data, error, mutate } = (0, index_1.useSWRWithGetFecher)(shouldFetch ? [urlWithQuery] : null);
    const setPageNumberAndAlterHistory = (pageNumber) => {
        const pathNameWithQuery = qs_1.default.stringify({
            url: location.pathname,
            query: {
                ...others,
                tab,
                page: pageNumber.toString(),
                pageSize: parsedPageSize,
            },
        });
        navigate(pathNameWithQuery);
    };
    const setPageSizeAndAlterHistory = (pageSize) => {
        const pathNameWithQuery = qs_1.default.stringify({
            url: location.pathname,
            query: {
                ...others,
                tab,
                page: parsedPageNumber,
                pageSize: pageSize.toString(),
            },
        });
        navigate(pathNameWithQuery);
    };
    return {
        pageNumber: parsedPageNumber,
        pageSize: parsedPageSize,
        total: Math.min(data?.total, data?.listLimit) || data?.total || 0, // used for pagination
        realTotal: data?.total || 0, // real total in response data
        data,
        error,
        mutate,
        nextPage: () => setPageNumberAndAlterHistory(Number(parsedPageNumber) + 1),
        prevPage: () => setPageNumberAndAlterHistory(Number(parsedPageNumber) - 1 || 1),
        gotoPage: setPageNumberAndAlterHistory,
        setPageSize: setPageSizeAndAlterHistory,
    };
};
exports.useTableDataByHttp = useTableDataByHttp;
