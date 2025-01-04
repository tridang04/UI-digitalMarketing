import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserManage.scss"
import { getAllUsers, createNewUsersFromService, deleteUser,addInforUserToMGDB } from "../../services/userService"
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter'


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            isOpenModal: false
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact()
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL')
        if (response && response.data.length > 0) {

            this.setState({
                listUsers: response.data

            })
        }
    }
    handleOpenModalUser = () => {
        this.setState({
            isOpenModal: true
        })
    }

    toglleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal

        })

    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUsersFromService(data);
            console.log('check response: ', response)
            console.log('check errcode: ', response.errCode)
            if (response && response.errCode === 1) {
                await addInforUserToMGDB();
                this.toglleUserModal()
                await this.getAllUsersFromReact()
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log('error: ', e)
        }
    }

    handleDeleteUser = async (user) => {
        console.log('check userid: ', user.userID)
        let response = await deleteUser(user.userID)
        alert(response.errMessage)
        if (response && response.errCode === 0) {
            await this.getAllUsersFromReact()
        }
    }
    render() {
        let { listUsers, isOpenModal } = this.state
        return (
            <>

                <ModalUser createNewUser={this.createNewUser} isOpenModal={isOpenModal} toglleFromParent={this.toglleUserModal} />

                <div className="user-container">

                    <div className="title text-center">

                        Manage users
                    </div>

                    <div className='mx-1'>
                        <button className='btn btn-primary' onClick={() => this.handleOpenModalUser()}>
                            <i className="fas fa-plus"></i>
                            Add a new user
                        </button>
                    </div>
                    <div className='user-table mt-3 mx-1'>
                        <table id="customers">
                            <tbody>

                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Username</th>
                                    <th>Phone Number</th>
                                    <th>Action</th>
                                </tr>

                                {listUsers.map((itemUser, index) => (
                                    (
                                        <>
                                            <tr key={index}>
                                                <td>{itemUser.name}</td>
                                                <td>{itemUser.address}</td>
                                                <td>{itemUser.username}</td>
                                                <td>{itemUser.phoneNumber}</td>
                                                <td className='action-icon text-center'>
                                                    <i className="fas fa-edit _edit"></i>
                                                    <i className="fas fa-trash _delete" onClick={() => this.handleDeleteUser(itemUser)}></i>
                                                </td>

                                            </tr>
                                        </>
                                    )
                                ))}

                            </tbody>

                        </table>
                    </div>
                </div>

            </>

        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
