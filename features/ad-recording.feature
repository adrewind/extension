
Feature: Ad fragment selection
  As an internet user
  In order to report about ad inside video
  I should be able to select ad fragment

  Background:
    Given Local storage state is "{'###guide': 3}"

  Scenario: Recording ad fragment
    Given I am watch "mKzLoZFz8PE" video
    And I skip In-Stream ad if it needed
    When I click AD button
    And I click ".adr-ad-help-text" element
    And I wait "5" seconds
    And I click ".adr-ad-help-text" element
    Then I should see ".adr-ad-selection" element

  Scenario: Keeping selection bar opened while it activated
    Given I am watch "4oqfodY2Lz0" video
    And I skip In-Stream ad if it needed
    When I click AD button
    And I move mouse out of player
    And I wait "3" seconds
    Then I should see ".adr-ad-sel-menu" element

  Scenario: Current time shall be updating
    Given I am watch "4oqfodY2Lz0" video
    And I skip In-Stream ad if it needed
    When I click AD button
    And I move mouse out of player
    Then Current time in player shall be updating

  Scenario: Disable annotations while selection bar is activated
    Given I am watch "2vMH8lITTCE" video
    And I skip In-Stream ad if it needed
    When I enable annotations
    And I click AD button
    # TODO: increase readability, analyse waits and move them to js if it possible
    And I wait "1" seconds
    Then Annotations must be disabled

    When I click AD button
    Then Annotations must be enabled

  Scenario: Preserve annotations state
    Given I am watch "2vMH8lITTCE" video
    And I skip In-Stream ad if it needed
    When I disable annotations
    And I click AD button
    Then Annotations must be disabled

    When I click AD button
    Then Annotations must be disabled
