import { expect, describe, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { login, register, updateUser, deleteAccount } from '../../src/api/endpointMethods/Users.cjs'; 

describe('users', () => {
    
    test('Testing for if logging in works', async () => {

        const mockedData = {
            token: 'fake-Token',
        };

        const mockedJson = vi.fn().mockResolvedValue(mockedData)
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        })

        global.fetch = mockedFetch;

        const email = 'testingemail@googoogaga.huh'
        const password = 'AnUnbelievablePassword'

        const result = await login(email, password)

        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/login`,
            expect.objectContaining({
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: expect.anything(),
            })
        )
        
        expect(mockedJson).toHaveBeenCalled()
        expect(result).toEqual(mockedData)
    })

    test('Testing for registration', async () => {

        const mockedData = {
            userID: '1',
        };

        const mockedJson = vi.fn().mockResolvedValue(mockedData)
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        })

        global.fetch = mockedFetch;

        const name = 'testerMcGoober'
        const email = 'testingemail@googoogaga.huh'
        const password = 'AnUnbelievablePassword'

        const result = await register(name, email, password)

        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/users`,
            expect.objectContaining({
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: expect.anything(),
            })
        )
        
        expect(mockedJson).toHaveBeenCalled()
        expect(result).toEqual(mockedData)
    })

    test('Testing for user update', async () => {

        const mockedData = {
            userID: '1',
        };

        const mockedJson = vi.fn().mockResolvedValue(mockedData)
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        })

        global.fetch = mockedFetch;

        const token = 'fakeToken'
        const name = 'testerMcGoober'
        const email = 'testingemail@googoogaga.huh'
        const password = 'AnUnbelievablePassword'

        const result = await updateUser(token, name, email, password)

        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/users`,
            expect.objectContaining({
                method: `PUT`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: expect.anything(),
            })
        )
        
        expect(mockedJson).toHaveBeenCalled()
        expect(result).toEqual(mockedData)
    })

    test('Testing for user deletion', async () => {

        const mockedData = {
            userID: '1',
        };

        const mockedJson = vi.fn().mockResolvedValue(mockedData)
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        })

        global.fetch = mockedFetch;

        const token = 'fakeToken'

        const result = await deleteAccount(token)

        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/users`,
            expect.objectContaining({
                method: `DELETE`,
            })
        )
        
        expect(mockedJson).toHaveBeenCalled()
        expect(result).toEqual(mockedData)
    })
})
