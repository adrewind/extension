
Feature: Entry points
  As an internet user
  To use plugin
  It should be loaded from any entry point

  Scenario: Main page as entry point
    Given I on the "https://www.youtube.com/" page
    When I click on first suggested video
    And I pause the video
    Then I should see AD button

  Scenario: Video as an entry point
    Given I on the "https://www.youtube.com/watch?v=BNHR6IQJGZs" page
    When I pause the video
    Then I should see AD button

  Scenario: Playlist as an entry point
    Given I on the "https://www.youtube.com/results?q=best+coub&sp=CAMSAhAD" page
    When I click on first suggested video
    And I pause the video
    Then I should see AD button

  # Old YouTube frontend uses two separate players
  # We can create two ADRManager instances in the future
  # Scenario: Youtube channel as an entry point
  #   Given I on the "PewDiePie" channel
  #   When I pause the video
  #   Then I should see AD button
