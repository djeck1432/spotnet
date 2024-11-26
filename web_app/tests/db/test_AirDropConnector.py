'''
Test Cases
1. Test Case: Normal Behavior
Scenario: The user has multiple airdrops, and they are deleted successfully.
Expectation: The function deletes all airdrops and commits the transaction.

'''

def test_delete_all_users_airdrop_success(mocker):
    mock_session = mocker.patch("scoped_session", autospec=True)
    mock_db = mock_session.return_value.__enter__.return_value
    mock_query = mock_db.query.return_value
    mock_airdrops = [mocker.Mock(), mocker.Mock()]
    mock_query.filter_by.return_value.all.return_value = mock_airdrops

    instance = AirDropDBConnector(DBConnector) 
    instance.delete_all_users_airdrop(user_id=uuid.uuid4())

    assert mock_query.filter_by.called_once_with(user_id=uuid.uuid4())
    assert mock_db.delete.call_count == len(mock_airdrops)
    mock_db.commit.assert_called_once()