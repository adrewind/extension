
Feature: Icon in right panel of Youtube player
  As an internet user
  In order to access ad cut menu
  I should be able to see ᏆAD icon

  Background:
    Given Local storage state is "{'###guide': 1}"

  Scenario: Trying to open
    Given I am watch "mKzLoZFz8PE" video
    And I skip In-Stream ad if it needed
    When I click AD button
    Then I should see ".adr-ad-sel-menu" element
