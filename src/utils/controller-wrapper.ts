const ControllerWrapper =
  (func: Function) =>
  async (...args: any[]) => {
    try {
      const result = await func(...args);
      return Response.json(result, { status: result.status || 200 });
    } catch (error: any) {
      console.log(error);
      return Response.json({ error: error.message || 'Something went wrong!' }, { status: error.status || 500 });
    }
  };

export { ControllerWrapper };
