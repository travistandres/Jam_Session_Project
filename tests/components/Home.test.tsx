import { it, expect, describe, test, beforeEach } from 'vitest';
import {fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Home from '../../src/Home';
import { getProjects } from "../../src/api/endpointMethods/Projects.cjs";
import '@testing-library/jest-dom/vitest';



describe('home', () => {
    test("Renders Home page with correct elements", () => {
        render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        );

        const projectsh1 = screen.getByText("Projects", { selector: "h1" });
        const projectsp = screen.getByText("Projects", { selector: "p" });
    
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(projectsh1).toBeInTheDocument();
        expect(projectsp).toBeInTheDocument();
        expect(screen.getByText("Sign Out")).toBeInTheDocument();
        
        
      });

      //Test for getProjects API call
      test("Testing if getProjects returns appropriate data", async () => {
        
        //Creating test data
        const mockedData = [
            {id: 1, projectName: 'project1', projectId: 1 },
            {id: 2, projectName: 'project2',  projectId: 2 },
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Setting test token and project ID
        const token = 'fakeToken';
        const projectID = 1; //maybe delete this 
        const result = await getProjects(token);

        //Asserting the function was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/projects`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
      })
})

// interface Project {
//     name: string;
//   }

// vi.mock('../../src/api/endpointMethods/Projects.cjs', () => ({
//     getProjects: vi.fn(), // Mock API method.
// }));

// describe('Home Component', () => {
//     beforeEach(() => {
//         vi.clearAllMocks(); // Ensure mocks are reset before each test.
//     });

//     it('renders the title and initial content', () => {
//         render(<Home />);
        
//         // Assert that the title is present.
//         expect(screen.getByText(/Home/i)).toBeInTheDocument();

//         // Assert that a loading indicator or empty state is displayed.
//         expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
//     });

//     it('displays items fetched from the API', async () => {
//         const mockProjects = [{ name: 'Project 1' }, { name: 'Project 2' }] as unknown as JSON[];
//         (getProjects as vi.Mock).mockResolvedValueOnce(mockProjects);



//         render(<Home />);

//         // Wait for items to appear in the DOM.
//         await waitFor(() => {
//             mockProjects.forEach((project) => {
//               expect(screen.getByText(project.name)).toBeInTheDocument();
//             });
//         });
//     });

//     it('handles API errors gracefully', async () => {
//         (getProjects as jest.MockedFunction<typeof getProjects>).mockRejectedValueOnce(new Error('Failed to fetch'));

//         render(<Home />);

//         // Wait for error message to appear.
//         await waitFor(() => {
//             expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
//         });
//     });

//     it('refreshes the data when the button is clicked', async () => {
//         const initialItems = ['Item 1', 'Item 2'];
//         const refreshedItems = ['Item A', 'Item B'];
        
//         getProjects
//             .mockResolvedValueOnce(initialItems) // Initial fetch.
//             .mockResolvedValueOnce(refreshedItems); // Fetch after refresh.

//         render(<Home />);

//         // Wait for initial items to appear.
//         await waitFor(() => {
//             initialItems.forEach(item => {
//                 expect(screen.getByText(item)).toBeInTheDocument();
//             });
//         });

//         // Simulate button click to refresh data.
//         const refreshButton = screen.getByText(/Refresh/i);
//         fireEvent.click(refreshButton);

//         // Wait for refreshed items to appear.
//         await waitFor(() => {
//             refreshedItems.forEach(item => {
//                 expect(screen.getByText(item)).toBeInTheDocument();
//             });
//         });

//         // Ensure old items are no longer displayed.
//         initialItems.forEach(item => {
//             expect(screen.queryByText(item)).not.toBeInTheDocument();
//         });
//     });
// });


/*
// Mock the getProjects method
vi.mock('../endpointMethods/Projects.cjs', () => ({
  getProjects: vi.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays items fetched from the API', async () => {
    const mockProjects = [
      { name: 'Project 1' },
      { name: 'Project 2' },
    ] as unknown as JSON[];

    (getProjects as jest.MockedFunction<typeof getProjects>).mockResolvedValueOnce(mockProjects);

    render(<Home />);

    await waitFor(() => {
      mockProjects.forEach((project: any) => {
        expect(screen.getByText(project.name)).toBeInTheDocument();
      });
    });
  });
});
*/
