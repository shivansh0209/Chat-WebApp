const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export default asyncHandler

// const func = (fn) => { ()=>{} }

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }


//Example usage
/*
const asyncHandler2 = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

// Define an asynchronous function to wrap
const exampleAsyncFunction = async (req, res, next) => {
    const data = await fetchData();
    res.json(data);
};

// Use asyncHandler2 to wrap the asynchronous function
const wrappedFunction = asyncHandler2(exampleAsyncFunction);

*/