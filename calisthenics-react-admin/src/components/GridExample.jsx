import React from 'react';

function GridExample() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Grid System Example</h2>
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="card p-3 bg-blue-100 border-round shadow-1">
            <h3 className="text-lg font-semibold mb-2">Column 1</h3>
            <p className="text-sm text-gray-700">This is the first column with blue background</p>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="card p-3 bg-green-100 border-round shadow-1">
            <h3 className="text-lg font-semibold mb-2">Column 2</h3>
            <p className="text-sm text-gray-700">This is the second column with green background</p>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="card p-3 bg-yellow-100 border-round shadow-1">
            <h3 className="text-lg font-semibold mb-2">Column 3</h3>
            <p className="text-sm text-gray-700">This is the third column with yellow background</p>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="card p-3 bg-red-100 border-round shadow-1">
            <h3 className="text-lg font-semibold mb-2">Column 4</h3>
            <p className="text-sm text-gray-700">This is the fourth column with red background</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Responsive Grid Example</h3>
        <div className="grid">
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2">
            <div className="card p-2 bg-purple-100 border-round text-center">
              <span className="text-sm font-medium">XS: 2</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Responsive breakpoints: SM (2 cols) → MD (3 cols) → LG (4 cols) → XL (6 cols)
        </p>
      </div>
    </div>
  );
}

export default GridExample; 